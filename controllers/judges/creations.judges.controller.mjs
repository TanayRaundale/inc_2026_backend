import { sendCookie, randomID, AppError } from "../../utils/index.js";
import { groupLinks, roles, whatsappLinks } from "../../static/adminData.mjs";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

function creationsJudgesController(judgesServices, emailService) {
  async function insertJudge(req, res, next) {
    try {
      const { events, accessCode, ...rest } = req.body; // Destructure events from req.body
      const event_code = events == 'concepts' ? 'CO-J' : 'IM-J';
      const jid = event_code + randomID(7);
      const password = randomID(8);

      const eventNames = {
        'concepts': 'Concepts',
        'impetus': 'Impetus'
      };

      // console.log(accessCode, process.env.URL_ACCESS_CODE);

      if(!accessCode || accessCode.trim() !== process.env.URL_ACCESS_CODE){
        throw new AppError(400, 'fail', 'URL Access Code did not match');
      }
      
      await judgesServices.insertJudge({
        events: [events],
        ...rest,
        jid,
        password,
        roles: [roles[7], roles[2]],
      });

      await emailService.judgeRegistrationEmail({
        events: eventNames[events],
        ...rest,
        jid,
        password,
      });
      
      res.status(201).json({success: true});
    } catch (err) {
      next(err);
    }
  }


  async function evaluateProject(req, res, next) {
    try {
      const { event_name } = req.params;
      const { pid, jid } = req.body;
      const isExist = await judgesServices.existingAllocation(pid, jid, event_name);
      if (isExist['COUNT(*)'] >= 1) {
        res.status(401).json({message: 'Existing Allocation'}).end();
      }
      else {
        await judgesServices.evaluateProject(event_name, req.body);
        res.status(201).end();
      }
    } catch (err) {
      next(err);
    }
  }



  return {
    insertJudge,
    evaluateProject,
  };
}

export default creationsJudgesController;
