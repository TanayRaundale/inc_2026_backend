import { eventsQueries, ticketQueries } from "../../../models/index.js";
import { AppError } from "../../../utils/index.js";
import { eventsName } from "../../../static/eventsData.mjs";

function eventsServices(db) {
  async function getUserRegistration(event_name, email) {
    try {
      const [results] = await db
        .execute(eventsQueries.checkUserRegistration(event_name), [email])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getRegistrations(event_name) {
    try {
      const [results] = await db
        .execute(eventsQueries.getRegistrations(), [event_name])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getTicketDetails(ticket) {
    try {
      const [[results]] = await db
        .execute(ticketQueries.checkTicket, [ticket])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getMembersFromTicket(ticket) {
    try {
      const [[results]] = await db
        .execute(ticketQueries.getMembers, [ticket])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getTechfiestaMembersFromId(team_id){
    try{
      const [[data]] = await db
      .execute(eventsQueries.getTechfiestaMembers(), [team_id])
      .catch((err) => {
        throw new AppError(400, "fail", err.sqlMessage);
      });
      // // console.log(data[0]);
      return data[0];
    }
    catch(err){
      throw err;
    }
  }

  async function deleteMemberDetails(ticket, index) {
    try {
      // // // console.log(ticket);
      const [results] = await db
        .execute(`UPDATE tickets
          SET step_2 = JSON_REMOVE(step_2, ?)
          WHERE ticket = ?;`
          , [`$[${index}]`, ticket])
        .catch((err) => {
          throw new AppError(400, 'fail', err.sqlMessage);
        });

      if (results.affectedRows > 0) {
        return results;
      } else {
        throw new AppError(404, 'fail', 'Ticket not found or step_2 index out of bounds');
      }
    } catch (err) {
      throw err;
    }
  }

  async function getPaymentDetails(pid, event_name) {
    try {
      const [results] = await db
        .execute(
          ticketQueries.getPayment,
          [event_name[0].toUpperCase(), pid]
        )
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results;
    } catch (err) {
      throw err;
    }
  }

  async function insertTicket(data) {
    try {
      const [results] = await db
        .execute(
          { sql: ticketQueries.insertTicket, namedPlaceholders: true },
          data
        )
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function editStepData(ticket, step_no, data) {
    try {
      const [results] = await db
        .execute(ticketQueries.editStepData(step_no), [data, step_no, ticket])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function editPaymentAndStep(data, updated_step) {
    try {
      // // // console.log(data)
      const [results] = await db
        .execute(ticketQueries.editPaymentAndStep, [
          updated_step,
          data.payment_id,
          data.ticket,
        ])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      // // // console.log(err);
      throw err;
    }
  }

  async function saveRegistrationDetails(data, updated_step){
    try{
      const [results] = await db
        .execute(ticketQueries.saveRegistrationDetails, [
          updated_step,
          data.payment_id,
          data.ticket,
          data.team_id,
          data.event,
        ])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    }
    catch(err){
      throw err;
    }
  }

  async function getAllTeamLeaders(){
    try {
      const [projects] = await db.execute(`SELECT pid, title, domain, project_type FROM inc_2025.concepts_projects;`)
      .catch((err) => console.log(err));

      const [credentials] = await db.execute(`SELECT username, password FROM inc_2025.admin WHERE roles LIKE '%JUDGE%';`)
      .catch((err) => console.log(err));

      return { projects, credentials };

    } catch (error) {
      throw error;
    }
  }

  async function countTicketCategories() {
    try {
      const [results] = await db.execute('CALL countTicketCategories();')
      .catch((err) => {
        throw new AppError(400, "fail", err.sqlMessage);
      })
      return results[0]
    } catch (error) {
      throw error;
    }
  }

  async function checkPaymentIdExist(payment_id) {
    try {
      const [results] = await db.execute(ticketQueries.checkPaymentIdExist, [payment_id])
      .catch((err) => {
        throw new AppError(400, "fail", err.sqlMessage);
      })
      return results[0]?.payment_id || '';
    } catch (error) {
      throw error;
    }
  }

  async function completeRegistration(event_name, data) {
    try {
      const {
        step_1: {
          title,
          domain,
          project_type,
          guide_name,
          guide_email,
          guide_phone,
          hod_email,
          sponsored,
          company,
          nda,
          abstract,
          demo,
          reason_of_demo,
        },
        step_2,
        step_3: {
          college,
          year,
          country,
          state,
          district,
          city,
          locality,
          mode,
          reason_of_mode,
          referral,
        },
        ticket,
        payment_id,
      } = data;

      const group_id = '';
      const tech_group_id = '';
      const tech_Transaction_id = '';
      const group_leader_email = step_2[0]?.name;
      const techfiesta = '';
      const department = '';

      let dataArray = [];
      switch (event_name) {
        case eventsName[0]:
          switch (step_2.length) {
            case 2:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                mode,
                reason_of_mode,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                college,
                department,
                group_id,
                country,
                state,
                district,
                city,
                locality,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;

            case 3:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                mode,
                reason_of_mode,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                step_2[2].name,
                step_2[2].email,
                step_2[2].phone,
                step_2[2].gender,
                college,
                department,
                group_id,
                country,
                state,
                district,
                city,
                locality,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;

            case 4:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                mode,
                reason_of_mode,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                step_2[2].name,
                step_2[2].email,
                step_2[2].phone,
                step_2[2].gender,
                step_2[3].name,
                step_2[3].email,
                step_2[3].phone,
                step_2[3].gender,
                college,
                department,
                group_id,
                country,
                state,
                district,
                city,
                locality,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;

            case 5:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                mode,
                reason_of_mode,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                step_2[2].name,
                step_2[2].email,
                step_2[2].phone,
                step_2[2].gender,
                step_2[3].name,
                step_2[3].email,
                step_2[3].phone,
                step_2[3].gender,
                step_2[4].name,
                step_2[4].email,
                step_2[4].phone,
                step_2[4].gender,
                college,
                department,
                group_id,
                country,
                state,
                district,
                city,
                locality,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;
          }
          break;

        case eventsName[1]:
          switch (step_2.length) {
            case 2:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                demo,
                reason_of_demo,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                college,
                year,
                country,
                state,
                district,
                city,
                locality,
                mode,
                reason_of_mode,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;

            case 3:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                demo,
                reason_of_demo,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                step_2[2].name,
                step_2[2].email,
                step_2[2].phone,
                step_2[2].gender,
                college,
                year,
                country,
                state,
                district,
                city,
                locality,
                mode,
                reason_of_mode,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;

            case 4:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                demo,
                reason_of_demo,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                step_2[2].name,
                step_2[2].email,
                step_2[2].phone,
                step_2[2].gender,
                step_2[3].name,
                step_2[3].email,
                step_2[3].phone,
                step_2[3].gender,
                college,
                year,
                country,
                state,
                district,
                city,
                locality,
                mode,
                reason_of_mode,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;

            case 5:
              dataArray = [
                title,
                domain,
                project_type,
                guide_name,
                guide_email,
                guide_phone,
                hod_email,
                sponsored,
                company,
                nda,
                abstract,
                demo,
                reason_of_demo,
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                step_2[2].name,
                step_2[2].email,
                step_2[2].phone,
                step_2[2].gender,
                step_2[3].name,
                step_2[3].email,
                step_2[3].phone,
                step_2[3].gender,
                step_2[4].name,
                step_2[4].email,
                step_2[4].phone,
                step_2[4].gender,
                college,
                year,
                country,
                state,
                district,
                city,
                locality,
                mode,
                reason_of_mode,
                referral,
                ticket,
                payment_id,
                techfiesta,
                group_leader_email,
                tech_group_id,
                tech_Transaction_id,
              ];
              break;
          }
          break;

        case eventsName[2]:
          switch (step_2.length) {
            case 1:
              dataArray = [
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[0].codechef_id,
                college,
                year,
                country,
                state,
                district,
                city,
                locality,
                mode,
                reason_of_mode,
                referral,
                ticket,
                payment_id,
              ];
              break;

            case 2:
              dataArray = [
                step_2[0].name,
                step_2[0].email,
                step_2[0].phone,
                step_2[0].gender,
                step_2[0].codechef_id,
                step_2[1].name,
                step_2[1].email,
                step_2[1].phone,
                step_2[1].gender,
                step_2[1].codechef_id,
                college,
                year,
                country,
                state,
                district,
                city,
                locality,
                mode,
                reason_of_mode,
                referral,
                ticket,
                payment_id,
              ];
              break;
          }
          break;
      }
      const [[results]] = await db
        .execute(
          eventsQueries.completeRegistration(event_name, step_2.length),
          dataArray
        )
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getPendingPayments(event_name) {
    try {
      const [results] = await db
        .execute(ticketQueries.getPendingPayments, [
          event_name[0].toUpperCase(),
        ])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getIncompleteRegistrations(event_name) {
    try {
      const [results] = await db
        .execute(ticketQueries.getIncompleteRegistrations, [
          event_name[0].toUpperCase(),
        ])
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getAbstractFrompid(pid, event_name) {
    try {
      const [results] = await db
        .execute(eventsQueries.getProjectAbstractQ(pid, event_name))
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results;

    } catch (error) {
      throw error;
    }
  }

  async function updateAbstractFrompid(pid, event_name, abstract) {
    try {
      const [results] = await db
        .execute(eventsQueries.updateProjectAbstractQ(event_name, pid, abstract))
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results;

    } catch (error) {
      throw error;
    }
  }

  async function getProjects(event_name) {
    try {
      const [results] = await db
        .execute(eventsQueries.getProjects(event_name))
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results;
    } catch (err) {
      throw err;
    }
  }

  async function getProjectsByTeamIds(event_name, team_ids) {
    try {
      const [results] = await db
        .execute(eventsQueries.getProjectsByTeamIds(event_name, team_ids))
        .catch((err) => {
          console.log(err);
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results;
    } catch (err) {
      throw err;
    }
  }

  async function getProject(event_name, pid) {
    try {
      pid = pid.map(id => `'${id}'`).join(",")
      const [results] = await db
        .execute(eventsQueries.getProject({ event_name, pid }))
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results;
    } catch (err) {
      throw err;
    }
  }

  async function updateProject(data) {
    try {
      const [results] = await db
        .execute(
          { sql: eventsQueries.updateProject(data), namedPlaceholders: true },
          data
        )
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });

      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function insertPICT(data) {
    try {
      const {
        title,
        abstract,
        domain,
        guide_email,
        guide_name,
        project_type,
        name,
        phone,
        email,
      } = data;
      let dataArray = [];
      switch (name.length) {
        case 1:
          dataArray = [
            title,
            domain,
            project_type,
            guide_name,
            guide_email,
            abstract,
            name[0],
            email[0],
            phone[0],
          ];
          break;

        case 2:
          dataArray = [
            title,
            domain,
            project_type,
            guide_name,
            guide_email,
            abstract,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
          ];
          break;

        case 3:
          dataArray = [
            title,
            domain,
            project_type,
            guide_name,
            guide_email,
            abstract,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
            name[2],
            email[2],
            phone[2],
          ];
          break;

        case 4:
          dataArray = [
            title,
            domain,
            project_type,
            guide_name,
            guide_email,
            abstract,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
            name[2],
            email[2],
            phone[2],
            name[3],
            email[3],
            phone[3],
          ];
          break;

        case 5:
          dataArray = [
            title,
            domain,
            project_type,
            guide_name,
            guide_email,
            abstract,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
            name[2],
            email[2],
            phone[2],
            name[3],
            email[3],
            phone[3],
            name[4],
            email[4],
            phone[4],
          ];
          break;
      }
      const [[results]] = await db
        .execute(eventsQueries.insertPICT(name.length), dataArray)
        .catch((err) => {

          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function insertImpetusPICT(data) {
    try {
      const {
        title,
        abstract,
        domain,
        year,
        project_type,
        name,
        phone,
        email,
      } = data;
      let dataArray = [];
      switch (name.length) {
        case 1:
          dataArray = [
            title,
            domain,
            project_type,
            abstract,
            year,
            name[0],
            email[0],
            phone[0],
          ];
          break;

        case 2:
          dataArray = [
            title,
            domain,
            project_type,
            abstract,
            year,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
          ];
          break;

        case 3:
          dataArray = [
            title,
            domain,
            project_type,
            abstract,
            year,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
            name[2],
            email[2],
            phone[2],
          ];
          break;

        case 4:
          dataArray = [
            title,
            domain,
            project_type,
            abstract,
            year,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
            name[2],
            email[2],
            phone[2],
            name[3],
            email[3],
            phone[3],
          ];
          break;

        case 5:
          dataArray = [
            title,
            domain,
            project_type,
            abstract,
            year,
            name[0],
            email[0],
            phone[0],
            name[1],
            email[1],
            phone[1],
            name[2],
            email[2],
            phone[2],
            name[3],
            email[3],
            phone[3],
            name[4],
            email[4],
            phone[4],
          ];
          break;
      }
      const [[results]] = await db
        .execute(eventsQueries.insertImpetusPICT(name.length), dataArray)
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getBackup(data) {
    try {
      const results = await db
        .execute(eventsQueries.getBackups())
        .catch((err) => {
          throw new AppError(400, "fail", err.sqlMessage);
        });
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  async function getAllTicketsCountForBackup(lastBackupTimestamp){
    try {
      const [results] = await db.execute(eventsQueries.getAllTicketsCountForBackup(), [lastBackupTimestamp])
      .catch(err => {throw new AppError(400, 'fail', err.sqlMessage)}); 
      return results[0].total;
    } catch (error) {
      throw error;
    }
  }

  async function getAllTicketsForBackup(lastBackupTimestamp, BATCH_SIZE, offset){
    try {
      const [results] = await db.execute(eventsQueries.getAllTicketsForBackup(), [lastBackupTimestamp, BATCH_SIZE, offset])
      .catch(err => {throw new AppError(400, 'fail', err.sqlMessage)}); 
      return results;
    } catch (error) {
      throw error;
    }
  }

  // async function insertBackup(results) {
  //   try {
  //     for (const backupData of results) {
  //       // Insert step_1 details into concepts_projects table
  //       const step1 = backupData.step_1;
  //       await db.execute(
  //         `INSERT INTO inc_2024.concepts_projects (pid, title, domain, company, abstract, hod_email, sponsored, guide_name, guide_email, guide_phone, project_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //         [backupData.pid, step1.title, step1.domain, step1.company, step1.abstract, step1.hod_email, step1.sponsored, step1.guide_name, step1.guide_email, step1.guide_phone, step1.project_type]
  //       );

  //       // Insert step_2 details into concepts_registrations table
  //       for (const member of backupData.step_2) {
  //         const { name, email, phone, gender } = member;
  //         await db.execute(
  //           `INSERT INTO inc_2024.concepts_registrations (pid, name, email, phone, gender) VALUES (?, ?, ?, ?, ?)`,
  //           [backupData.pid, name, email, phone, gender]
  //         );
  //       }
  //     }
  //     return results;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async function insertBackup(results) {
    try {
      for (const backupData of results) {
        // Insert step_1 details into concepts_projects table
        const step1 = backupData.step_1;
        await db.execute(
          `INSERT INTO inc_2024.impetus_projects (pid, title, domain, company, abstract, hod_email, sponsored, guide_name, guide_email, guide_phone, project_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [backupData.pid, step1.title, step1.domain, step1.company, step1.abstract, step1.hod_email, step1.sponsored, step1.guide_name, step1.guide_email, step1.guide_phone, step1.project_type]
        );

        // Insert step_2 details into concepts_registrations table
        for (const member of backupData.step_2) {
          const { name, email, phone, gender } = member;
          await db.execute(
            `INSERT INTO inc_2024.impetus_registrations (pid, name, email, phone, gender) VALUES (?, ?, ?, ?, ?)`,
            [backupData.pid, name, email, phone, gender]
          );
        }

        // Insert step_3 details into concepts_group_info table
        const step3 = backupData.step_3;
        await db.execute(
          `INSERT INTO inc_2024.impetus_group_info (pid, leader, city, mode, state, college, country, district, group_id, locality, referral, department, techfiesta, tech_group_id, reason_of_mode, group_leader_email, tech_Transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [backupData.pid, "ameyajay@gmail.com", step3.city, step3.mode, step3.state, step3.college, step3.country, step3.district, step3.group_id, step3.locality, step3.referral, step3.department, step3.techfiesta, step3.tech_group_id, step3.reason_of_mode, step3.group_leader_email, step3.tech_Transaction_id]
        );

      }
      return results;
    } catch (error) {
      throw error;
    }
  }




  return {
    getUserRegistration,
    getRegistrations,
    getTicketDetails,
    getMembersFromTicket,
    getPaymentDetails,
    insertTicket,
    editStepData,
    editPaymentAndStep,
    completeRegistration,
    getPendingPayments,
    getAbstractFrompid,
    updateAbstractFrompid,
    getProjects,
    getProject,
    updateProject,
    insertPICT,
    insertImpetusPICT,
    deleteMemberDetails,
    getBackup,
    insertBackup,
    getTechfiestaMembersFromId,
    saveRegistrationDetails,
    getAllTeamLeaders,
    countTicketCategories,
    getAllTicketsCountForBackup,
    getAllTicketsForBackup,
    checkPaymentIdExist,
    getIncompleteRegistrations,
    getProjectsByTeamIds,

  };
}

export default eventsServices;