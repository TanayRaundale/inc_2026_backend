import { AppError } from "../../utils/index.js";
import { projectDomains } from "../../static/eventsData.mjs";

function getRegistrationsController(
  eventsServices,
  filesServices,
  docServices
) {
  async function getUserRegistration(req, res, next) {
    try {
      const { event_name } = req.params;
      const { email } = req.query;
      const user_email = await eventsServices.getUserRegistration(
        event_name,
        email
      );
      if (!user_email)
        throw new AppError(
          404,
          "fail",
          `Email ${user_email} not registered for ${event_name}`
        );
      res.status(302).json(user);
    } catch (err) {
      next(err);
    }
  }

  async function getRegistration(req, res, next) {
    try {
      const results = await eventsServices.getTicketDetails(req.query.ticket);
      if (!results)
        throw new AppError(
          404,
          "fail",
          "Invalid ticket, registration does not exist"
        );
      if (results.step_no === 4)
        throw new AppError(400, "fail", "Registration under verification");
      if (results.step_no !== 5)
        throw new AppError(400, "fail", "Registration steps incomplete");
      if (results.step_no === 5) res.status(302).json(results);
    } catch (err) {
      next(err);
    }
  }

  async function getRegistrations(req, res, next) {
    try {
      const results = await eventsServices.getRegistrations(
        req.params.event_name
      );
      if (!results) throw new AppError(404, "fail", "No registrations found");
      const processTeams = (name, email, phone) => {
        const names = name.split(',');
        const emails = email.split(',');
        const phones = phone.split(',');
        const teams = phones.map((phone, index) => ({
          name: names[index],
          email: emails[index],
          phone
        }))
        return teams;
      }
      
      const filteredResults = results.map((item, index) => {
        return {id: index,
        pid: item.pid,
        judges_count: item.judges_count || 0,
        evaluations: item.evaluations || "N/A",
        judging_within_allocations: item.judging_within_allocations || 0,
        projectDetails: {
          title: item.title,
          abstract: item.abstract,
          project_type: item.project_type,
          sponsored: item.sponsored,
          company: item.company,
          nda: item.nda,
          domain: item.domain,
          guide_name: item.guide_name,
          guide_email: item.guide_email,
          guide_phone: item.guide_phone,
          hod_email: item.hod_email,
          techfiesta: item.techfiesta,
        },
        teamDetails: processTeams(item.name, item.email, item.phone),
        collegeDetails: {
          college: item.college,
          year: item.year,
          city: item.city,
          district: item.district,
          locality: item.locality,
          mode: item.mode,
        },
        paymentId: item.payment_id,
        }
      })
      res.status(302).json(filteredResults);
    } catch (err) {
      next(err);
    }
  }

  async function getTicketDetails(req, res, next) {
    try {
      const { ticket } = req.query;
      // // console.log(ticket)
      const results = await eventsServices.getTicketDetails(ticket);
      if (!results)
        throw new AppError(404, "fail", "Invalid ticket exists in cookie");
      delete results["pid"];
      delete results["payment_id"];
      delete results["date"];
      res.status(200).json(results);
    } catch (err) {
      // // console.log('herehere')
      next(err);
    }
  }

  async function getPaymentDetails(req, res, next) {
    try {
      const results = await eventsServices.getPaymentDetails(
        req.query.pid,
        req.params.event_name
      );
      if (!results)
        throw new AppError(
          404,
          "fail",
          "Invalid pid, registration does not exist"
        );
      res.status(302).json(results);
    } catch (err) {
      next(err);
    }
  }

  async function getUserIDFile(req, res, next) {
    try {
      const results = await filesServices.checkFile(req.query.email);
      if (!results)
        throw new AppError(404, "fail", "No file exist for this email");
      res.status(302).json({ data: results.file });
    } catch (err) {
      next(err);
    }
  }

  async function getMembersFromTicket(req, res, next) {
    try {
      const { ticket } = req.signedCookies;
      const results = await eventsServices.getMemberDetails(ticket);
      if (!results)
        throw new AppError(
          404,
          "fail",
          "No members were found"
        );
      res.status(302).json(results);
    } catch (error) {
      next(error);
    }
  }

  async function getMembersFromTicket(req, res, next) {
    try {
      const { ticket } = req.signedCookies;
      const results = await eventsServices.getMemberDetails(ticket);
      if (!results)
        throw new AppError(
          404,
          "fail",
          "No members were found"
        );
      res.status(302).json(results);
    } catch (error) {
      next(error);
    }
  }

  async function getPendingPayments(req, res, next) {
    try {
      const results = await eventsServices.getPendingPayments(
        req.params.event_name
      );
      if (!results) throw new AppError(404, "fail", "No pending payments");
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  }

  async function getIncompleteRegistrations(req, res, next) {
    try {
      const results = await eventsServices.getIncompleteRegistrations(
        req.params.event_name
      );
      if (!results) throw new AppError(404, "fail", "No Incomplete Registrations");
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  }

  async function getProjectAbstract(req, res, next) {
    try {
      const { pid } = req.body
      const temp = pid.substring(0, 2);
      // // // console.log(pid)
      let event_name;
      if (temp === "IM") event_name = "impetus"
      else if (temp === "CO") event_name = "concepts"
      else res.status(404).json({ msg: "Invalid ID" })

      const abstract = await eventsServices.getAbstractFrompid(pid, event_name);
      res.status(200).json(abstract);
    } catch (err) {
      next(err);
    }
  }

  async function updateProjectAbstract(req, res, next) {
    try {
      const { pid, abstract } = req.body
      const temp = pid.substring(0, 2);
      let event_name;
      if (temp === "IM") event_name = "impetus"
      else if (temp === "CO") event_name = "concepts"
      else throw new AppError(404, "fail", "Invalid ID");

      const updatedAbstract = await eventsServices.updateAbstractFrompid(pid, event_name, abstract);
      res.status(200).json({ pid, updatedAbstract });
    } catch (err) {
      next(err);
    }
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function getSynopsis(req, res, next) {
    try {
      let event_name = req.params.event_name;
      let team_ids = req.query.team_ids;
      let projects = [];
      let results = {};

      if(team_ids && team_ids !== 'null'){
        team_ids = team_ids.split(',').map(team_id => (`'${team_id.trim()}'`)).join(', ');
        projects = await eventsServices.getProjectsByTeamIds(event_name, team_ids);
      }
      else{
        projects = await eventsServices.getProjects(event_name);
      }
      
      Object.entries(projectDomains).forEach(domain => {
        results[domain[1]] = projects.filter(
          (project) => project.domain === domain[0]
        )
      })
      event_name = capitalizeFirstLetter(event_name);
      const pdfDoc = docServices.synopsisPDF(results, event_name);
      docServices.sendPDF(res, "synopsis", pdfDoc);
    } catch (err) {
      next(err);
    }
  }

  
  async function getRegistrationsCount(req, res, next){
    try {
      const results = await eventsServices.countTicketCategories();
      res.status(200).json(results[0]);
    } catch (error) {
      next(error)
    }
  }
  
  async function backupRegs(req, res, next) {
    try {
      const results = await eventsServices.getBackup();
      await eventsServices.insertBackup(results);

      res.json(results);
    } catch (err) {
      next(err);
    }
  }
  
  return {
    getUserRegistration,
    getRegistration,
    getRegistrations,
    getMembersFromTicket,
    getTicketDetails,
    getPaymentDetails,
    getUserIDFile,
    getPendingPayments,
    getProjectAbstract,
    updateProjectAbstract,
    getSynopsis,
    backupRegs,
    getRegistrationsCount,
    getIncompleteRegistrations,

  };
}

export default getRegistrationsController;
