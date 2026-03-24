import { readFileSync } from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';
import { AppError } from '../../utils/index.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

const __dirname = path.resolve();

function createBackupController(eventsServices, adminServices){

  async function backupTickets(req, res, next){
    const server2Config = {
      host: process.env.AIVEN_HOST,
      user: process.env.AIVEN_USER,
      password: process.env.AIVEN_PASSWORD,
      database: process.env.AIVEN_DB,
      port: '18261',
      ssl: {
        require: true,
        ca: readFileSync(__dirname + '/ca-cert.pem'),
      },
    }
  
    const BATCH_SIZE = 100;

    let server2Connection;

    try {
      const { username, password } = req.query;
      const admin = await adminServices.findAdmin(username);
  
      if((!admin) || (admin.password !== password) || (!admin.roles.includes('WEB_MASTER'))){
        throw new AppError(403, "fail", "Invalid Credentials");
      }

      server2Connection = await mysql.createConnection(server2Config);
  
      console.log('Connected to Backup MySQL server.');
      
      const [lastBackupRow] = await server2Connection.execute("SELECT MAX(last_backup) AS last_backup FROM backup_logs WHERE table_name='tickets'");
      const lastBackupTimestamp = lastBackupRow[0].last_backup || '1970-01-01 00:00:00';

      console.log(`Last backup timestamp: ${lastBackupTimestamp}`);
      const totalRows = await eventsServices.getAllTicketsCountForBackup(lastBackupTimestamp);
      console.log(`Total new rows to backup: ${totalRows}`);
  
      if (totalRows === 0) {
        return res.send('No new data to back up.');
      }
  
      for (let offset = 0; offset < totalRows; offset += BATCH_SIZE) {
        const rows = await eventsServices.getAllTicketsForBackup(lastBackupTimestamp, BATCH_SIZE, offset);
        console.log(`Processing batch with offset ${offset}.`);
  
        await server2Connection.beginTransaction();
  
        const insertQuery =
          'REPLACE INTO tickets (ticket, pid, step_1, step_2, step_3, step_no, payment_id, date, is_deleted) VALUES ?';
        const values = rows.map(row => [
          row.ticket,
          row.pid,
          JSON.stringify(row.step_1),
          row.step_2 ? JSON.stringify(row.step_2) : null,
          row.step_3 ? JSON.stringify(row.step_3) : null,
          row.step_no,
          row.payment_id,
          row.date,
          row.is_deleted,
        ]);

        await server2Connection.query(insertQuery, [values]);
  
        await server2Connection.commit();
        console.log(`Batch with offset ${offset} backed up successfully.`);
      }
  
      const now = new Date(new Date().toLocaleString('en-US', {timeZone: 'Etc/GMT+7'}));
      await server2Connection.execute("UPDATE backup_logs SET last_backup=? WHERE table_name='tickets'", [now]);
  
      res.send('Incremental backup completed successfully.');
    } catch (error) {
      if (server2Connection) {
        await server2Connection.rollback();
      }
      next(error);
    } finally {
      if (server2Connection) await server2Connection.end();
      console.log('Connections closed.');
    }
  }

  async function backupAllTables(req, res, next){

  }

  return {
    backupTickets,
    backupAllTables,
  }
}

export default createBackupController;