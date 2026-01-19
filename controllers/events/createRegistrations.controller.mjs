import { sendCookie, randomID, AppError } from "../../utils/index.js";
import { eventsName, teamSize, projectTypes, getJudgingSlots } from "../../static/eventsData.mjs";
import { pictDetails } from "../../static/collegeDetails.mjs";
import { whatsappLinks } from "../../static/adminData.mjs";
import { readFileSync } from "fs";
import path from "path";

const __dirname = path.resolve();

function createRegistrationsController(
  eventsServices,
  filesServices,
  emailService
) {
  async function saveProject(req, res, next) {
    try {
      const { event_name, ticket } = req.query;
      const isTicketExists = await eventsServices.getTicketDetails(ticket);
      if (isTicketExists) {
        await eventsServices.editStepData(ticket, 1, req.body);
        res.status(200).json({ success: true, ticket }).end()
      } else {
        const ticket = "INC-" + event_name[0].toUpperCase() + randomID(12);
        await eventsServices.insertTicket({
          ticket,
          step_1: req.body,
          step_2: {},
          step_no: 1,
        });
        res.status(201).json({ success: true, ticket }).end()
      }
    } catch (err) {
      next(err);
    }
  }

  async function insertMember(req, res, next) {
    try {
      const { event_name, ticket } = req.query;

      const { email } = req.body;

      const user_email = await eventsServices.getUserRegistration(
        event_name,
        email
      );

      if (user_email)
        throw new AppError(
          404,
          "fail",
          `Email ${email} already registered for ${event_name}`
        );
      const member_id_file = req.file;
      const isTicketExists = await eventsServices.getTicketDetails(ticket);
      if (event_name === eventsName[2] && !isTicketExists) {
        const ticket = "INC-" + event_name[0].toUpperCase() + randomID(12);
        await eventsServices.insertTicket({
          ticket,
          step_1: {},
          step_2: [{ ...req.body }],
          step_no: 2,
        });
        // IMPs
        if (member_id_file) await filesServices.insertFile(email, member_id_file);
        res.status(201).json({ success: true, ticket }).end();
        return;
      }
      const existing_members = await eventsServices.getMembersFromTicket(
        ticket
      );
      if (!existing_members)
        throw new AppError(404, "fail", "Ticket does not exist");
      if (Array.isArray(existing_members.step_2)) {
        if (existing_members.step_2.length === teamSize.get(event_name))
          throw new AppError(400, "fail", "Maximum number of members reached");
        else {
          existing_members.step_2.forEach((member) => {
            if (member.email === email)
              throw new AppError(
                400,
                "fail",
                "Duplicate email address found in a team"
              );
          });
          if (member_id_file) await filesServices.insertFile(email, member_id_file);
          await eventsServices.editStepData(ticket, 2, [
            ...existing_members.step_2,
            req.body,
          ]);
        }
      } else {
        if (member_id_file) await filesServices.insertFile(email, member_id_file);
        await eventsServices.editStepData(ticket, 2, [{ ...req.body }]);
      }
      res.status(200).json({ success: true, ticket }).end()
    } catch (err) {
      next(err);
    }
  }

  async function getAddedMembers(req, res, next) {
    try {
      let { ticket } = req.query;

      const memberDetails = await eventsServices.getMembersFromTicket(ticket);
      // // // console.log('getmems ', memberDetails);
      res.status(200).json(memberDetails)

    } catch (error) {
      // // // console.log(error)
      next(error)
    }
  }

  async function getTechfiestaMembers(req, res, next) {
    try {
      const { team_id, event } = req.query;
      const members = await eventsServices.getTechfiestaMembersFromId(team_id?.toUpperCase());
      // console.log(members);
      if (!members) {
        throw new AppError(
          404,
          'fail',
          `Invalid Techfiesta Team ID.`
        )
      }
      if ((members.is_used.includes("nova") && (event === "nova")) || (members.is_used.includes("impetus") && (event === "impetus" || event === "concepts")) || (members.is_used.includes("concepts") && (event === "impetus" || event === "concepts"))) {
        // console.log('here')
        throw new AppError(
          404,
          'fail',
          `Team ${team_id} already registered. Change Team ID to continue.`
        )
      }
      else res.status(200).json(members);
    }
    catch (error) {
      next(error)
    }
  }

  async function addTechfiestaMembers(req, res, next) {
    try {
      const { ticket } = req.query;
      await eventsServices.editStepData(ticket, 2, [
        ...req.body
      ]);
      res.json('hello');
    } catch (error) {
      next(error)
    }
  }

  async function deleteMember(req, res, next) {
    try {
      let { ticket, index } = req.query;
      // let { index } = req.body; // Assuming memberID is the key for the member details to delete
      await eventsServices.deleteMemberDetails(ticket, Number(index));
      res.status(200).json({ message: 'Member details deleted successfully', success: true, ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function saveCollegeDetails(req, res, next) {
    try {
      const { ticket, event_name } = req.query;
      if (req.body.isPICT === "1") {
        req.body = { ...req.body, ...pictDetails };
      }
      await eventsServices.editStepData(ticket, 3, req.body);
      res.status(200).json({ success: true, ticket }).end()
    } catch (err) {
      next(err);
    }
  }

  async function requestRegistration(req, res, next) {
    try {
    
      const { event, ticket } = req.query;

      let results = await eventsServices.getTicketDetails(ticket);
       console.log("results:", results);
console.log("results length:", results?.length);
console.log("first row:", results?.[0]);
console.log("payment id:", results?.[0]?.payment_id);
      results = results?.[0];

      if (!results) throw new AppError(404, "fail", "Ticket does not exist");

 
     


      // if (results.payment_id !== "")  
      //   throw new AppError(
      //     400,
      //     "fail",
      //     "Registration done using this ticket and payment under verification"
      //   );
      if ((results.payment_id ?? "").trim() !== "")
  throw new AppError(
    400,
    "fail",
    "Registration done using this ticket and payment under verification"
  );
      else if (results.step_no === 3) {
        const { isPICT, isInternational } = results.step_3;
        const { techfiesta, team_id } = results.step_1;
        if(techfiesta === "1"){
          req.body = { ...req.body, payment_id: "TECHFIESTA" };
        } else if (isPICT === "1") {
          req.body = { ...req.body, payment_id: "PICT" };
        } else if (isInternational === "1") {
          req.body = { ...req.body, payment_id: "INTERNATIONAL" };
        }
        else {
          const dbPaymentId = await eventsServices.checkPaymentIdExist(req.body.payment_id);
          if(dbPaymentId.trim() === req.body.payment_id.trim()){
            throw new AppError(400, "fail", "Transaction ID already used");
          }
        }
        req.body = { ...req.body, team_id: team_id || '' };
        try {
          console.log("HELLO  i am here before saveregistration");
          await eventsServices.saveRegistrationDetails({ ...req.body, ticket, event }, 4);
           console.log("✅ SAVE SUCCESS step4");
        } catch (e) {
          console.log("❌ SAVE FAILED step4", e);
  throw e;
        }
        
        res.status(201).json({success: true, ticket}).end()
      } else if (results.step_no === 5 && results.payment_id !== "")
        throw new AppError(
          400,
          "fail",
          "Registration already completed using this ticket"
        );
      else throw new AppError(400, "fail", "Registration steps not completed");
    } catch (err) {
      next(err);
    }
  }


  // async function requestRegistration(req, res, next) {
  //   try {
  //     const { event, ticket } = req.query;

  //     const results = await eventsServices.getTicketDetails(ticket);
  //     if (!results) {
  //       throw new AppError(404, "fail", "Ticket does not exist");
  //     }

  //     /* --------------------------------------------------
  //        STEP VALIDATION (STATE MACHINE)
  //     -------------------------------------------------- */

  //     // Step 5 → already completed
  //     if (results.step_no === 5) {
  //       throw new AppError(
  //         400,
  //         "fail",
  //         "Registration already completed using this ticket"
  //       );
  //     }

  //     // Step 4 → already submitted, waiting for admin
  //     if (results.step_no === 4) {
  //       throw new AppError(
  //         400,
  //         "fail",
  //         "Registration already submitted and under verification"
  //       );
  //     }

  //     // Any step other than 3 is invalid here
  //     if (results.step_no !== 3) {
  //       throw new AppError(
  //         400,
  //         "fail",
  //         "Registration steps not completed"
  //       );
  //     }

  //     /* --------------------------------------------------
  //        STEP 3 → STEP 4 TRANSITION (PAYMENT SUBMISSION)
  //     -------------------------------------------------- */

  //     const { isPICT, isInternational } = results.step_3;
  //     const { techfiesta, team_id } = results.step_1;

  //     // Auto payment cases
  //     if (techfiesta === "1") {
  //       req.body = { ...req.body, payment_id: "TECHFIESTA" };
  //     } else if (isPICT === "1") {
  //       req.body = { ...req.body, payment_id: "PICT" };
  //     } else if (isInternational === "1") {
  //       req.body = { ...req.body, payment_id: "INTERNATIONAL" };
  //     }
  //     // Manual payment → check duplicate transaction ID
  //     else {
  //       const dbPaymentId = await eventsServices.checkPaymentIdExist(
  //         req.body.payment_id
  //       );

  //       if (
  //         dbPaymentId &&
  //         dbPaymentId.trim() === req.body.payment_id.trim()
  //       ) {
  //         throw new AppError(400, "fail", "Transaction ID already used");
  //       }
  //     }

  //     // Attach team_id if exists
  //     req.body = {
  //       ...req.body,
  //       team_id: team_id || "",
  //     };

  //     // Save payment + move ticket to step 4 (pending verification)
  //     await eventsServices.saveRegistrationDetails(
  //       { ...req.body, ticket, event },
  //       4
  //     );

  //     return res.status(201).json({ success: true, ticket }).end();
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  async function verifyPendingPayment(req, res, next) {
    try {
      const { ticket } = req.body;
      const { event_name } = req.params;
      const results = await eventsServices.getTicketDetails(ticket);
      if (!results) throw new AppError(404, "fail", "Ticket does not exist");
      if (results.step_no === 4) {
        const { pid } = await eventsServices.completeRegistration(
          event_name,
          results
        );
        const formattedEventName = event_name[0].toUpperCase() + event_name.slice(1);
        let formattedEmail = '';
        if (Array.isArray(results.step_2)) {
          formattedEmail = results.step_2.map((member) => `${member.name} <${member.email}>`).slice(0, 2).join(',');
        }
        const whatsapp_url = whatsappLinks.get(event_name);
        await emailService.eventRegistrationEmail(formattedEventName, {
          ...results,
          email: formattedEmail,
          whatsapp_url,
          pid,
        });
        res.status(201).json({ success: true }).end();
      } else if (results.step_no === 5 && results.payment_id !== "")
        throw new AppError(
          400,
          "fail",
          "Registration already completed using this ticket"
        );
      else throw new AppError(400, "fail", "Registration steps not completed");
    } catch (err) {
      next(err);
    }
  }
  async function updateProject(req, res, next) {
    try {
      const { pid, event_name } = req.query;
      const existingData = await eventsServices.getProject(event_name, pid);
      if (!existingData)
        throw new AppError(404, "fail", "Project does not exist");
      const newData = {
        title: req.body.title || existingData.title,
        abstract: req.body.abstract || existingData.abstract,
        mode: req.body.mode || existingData.mode,
      };
      await eventsServices.updateProject({ pid, event_name, ...newData });
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  async function insertInternalPICT(req, res, next) {
    try {
      const { event_name } = req.query
      const newData = {
        title: req.body.title,
        abstract: req.body.abstract,
        domain: req.body.domain,
        guide_name: req.body.guide_name || '',
        guide_email: req.body.guide_email || '',
        project_type: projectTypes[req.body.project_type],
        year: req.body?.year,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        department: req.body.department
      };
      console.log(newData);
      switch (event_name) {
        case eventsName[0]:
          const result = await eventsServices.insertPICT(newData)
          res.status(200).send(result);
          break;

        case eventsName[1]:
          const results = await eventsServices.insertImpetusPICT(newData)
          res.status(200).send(results);
          break;
      }
    } catch (err) {
      next(err);
    }
  }

  async function getAllTeamLeaders(req, res, next) {
    try {
      // const results = await eventsServices.getAllTeamLeaders();

      // console.log('starting job to send mails');

      // const preprocessData = (results) => {
      //   const projects = results.projects;
      //   const credentials = results.credentials;
      //   const judges = JSON.parse(readFileSync(path.join(__dirname, 'judges.json')));
      //   const slotsData = getJudgingSlots('concepts');

      //   const processProjectName = (pname) => {
      //     const temp = pname.replace('P', '').replace(' ', '');
      //     return temp;
      //   }

      //   judges.forEach((judge) => {
      //     if(judge.email){
      //       const temp = {
      //         judge_id: judge.judge_id,
      //         name: judge.name?.split(' ')[0] || 'Sir/Mam',
      //         email: judge.email,
      //         projects: judge.projects.map((project) => {
      //           // return projects.find((p) => p.pid == `CO-${processProjectName(project)}`);
      //           return projects.find((p) => p.pid == processProjectName(project));
      //         }),
      //         password: credentials.find((item) => item.username == judge.email)?.password || 'Contact Admin',
      //         slots: JSON.parse(`[${judge.slots}]`)
      //         .map(slot => parseInt(slot))
      //         .sort((a, b) => a - b)
      //         .map(slot => slotsData[slot])
      //         .join(", "),
      //       }
      //       data.push(temp);
      //     }
      //   })
      //   return data;
      // }

      // const data = preprocessData(results);

      // await emailService.sendBulkEmail(data);

      // await emailService.sendBulkEmail(results);

      // await emailService.sendBulkEmail(results); 

      return res.json('mail sent successfully');
    } catch (error) {
      next(error);
    }
  }

  return {
    saveProject,
    insertMember,
    getAddedMembers,
    saveCollegeDetails,
    requestRegistration,
    verifyPendingPayment,
    updateProject,
    insertInternalPICT,
    deleteMember,
    getTechfiestaMembers,
    addTechfiestaMembers,
    getAllTeamLeaders,

  };
}

export default createRegistrationsController;