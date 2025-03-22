import { eventsName } from '../../../static/eventsData.mjs';

function eventsQueries(tableName) {
    const checkUserRegistration = (event_name) => {
        switch (event_name) {
            case eventsName[0]:
                return `SELECT email FROM ${tableName.conceptsUsersTable} WHERE email = ?;`
            case eventsName[1]:
                return `SELECT email FROM ${tableName.impetusUsersTable} WHERE email = ?;`
            case eventsName[2]:
                return `SELECT email FROM ${tableName.pradnyaUsersTable} WHERE email = ?;`
            case eventsName[3]:
                return `SELECT email FROM ${tableName.novaUsersTable} WHERE email = ?;`
        }
    }

    const completeRegistration = (event_name, no_of_members) => {
        let placeholders = ''
        if (event_name === 'pradnya') {
            for (let i = 0; i < no_of_members; i++) placeholders += ', ?, ?, ?, ?, ?'
        } else {
            for (let i = 0; i < no_of_members; i++) placeholders += ', ?, ?, ?, ?'
        }
        // console.log(process.env[`INSERT_${event_name.toUpperCase()}_${no_of_members}`] + placeholders + ');')
        return process.env[`INSERT_${event_name.toUpperCase()}_${no_of_members}`] + placeholders + ');'
    }

    const insertPICT = (no_of_members) => {
        let placeholders = ''
        for (let i = 0; i < no_of_members; i++) placeholders += ', ?, ?, ?'
        return 'CALL insert_c_internal_' + `${no_of_members}` + '(?,?,?,?,?,?' + placeholders + ');'
    }

    const insertImpetusPICT = (no_of_members) => {
        let placeholders = ''
        for (let i = 0; i < no_of_members; i++) placeholders += ', ?, ?, ?'
        return 'CALL insert_i_internal_' + `${no_of_members}` + '(?,?,?,?,?' + placeholders + ');'
    }

    const getRegistrations = () => 'CALL getRegistrations(?);'

    // const getProjects = (data) => `SELECT title, ${data}_projects.pid ,  abstract , domain, mode FROM ${data}_projects INNER JOIN ${data}_group_info ON ${data}_projects.pid = ${data}_group_info.pid;`

    const getProjects = (data) => `SELECT title, ${data}_projects.pid ,  abstract , domain, mode FROM ${data}_projects INNER JOIN ${data}_group_info ON ${data}_projects.pid = ${data}_group_info.pid WHERE ${data}_projects.pid IN (
    'CO-OT0063', 'CO-OT0105', 'CO-OT0117', 'CO-OT1102', 'CO-OT1107', 'CO-OT1106', 'CO-OT0099', 'CO-OT1125', 'CO-OT1100', 'CO-OT1084', 'CO-OT0068', 'CO-OT0075', 'CO-OT0085', 'CO-OT0091', 'CO-OT0094', 'CO-OT0097', 'CO-OT0125', 'CO-OT1088', 'CO-OT0080', 'CO-OT0093', 'CO-OT0120', 'CO-OT1089', 'CO-OT0123', 'CO-OT1066', 'CO-OT1082', 'CO-OT1096', 'CO-ML1149',  'CO-ML1226',  'CO-ML0250',  'CO-ML0279',  'CO-ML1208',  'CO-ML0147',  'CO-ML1207',  'CO-ML1146',  'CO-ML1224',  'CO-ML1158',  'CO-ML1201',  'CO-ML1264',  'CO-ML1148',  'CO-ML0157', 'CO-ML1269',  'CO-ML1198',  'CO-ML0145',  'CO-ML1187',  'CO-ML1256',  'CO-ML1248',  'CO-ML1216',  'CO-ML1162',  'CO-ML1278',  'CO-ML1141',  'CO-ML1222',  'CO-ML1243',  'CO-ML1225',  'CO-ML1268',  'CO-ML1164',  'CO-ML1163',  'CO-ML0279',  'CO-ML1234',  'CO-ML0152',  'CO-ML1200',  'CO-ML1261',  'CO-ML1271',  'CO-ML1168',  'CO-ML1161',  'CO-ML0170',  'CO-ML1154',  'CO-ML0170',  'CO-ML1154',  'CO-AD0067', 'CO-AD1052', 'CO-AD1098', 'CO-AD0053', 'CO-AD0100', 'CO-AD0044', 'CO-AD0077', 'CO-AD0094', 'CO-AD1046', 'CO-AD1049', 'CO-AD1050', 'CO-AD1054', 'CO-AD1080', 'CO-AD1085', 'CO-AD0043', 'CO-AD0066', 'CO-AD0081', 'CO-AD0082', 'CO-AD1063', 'CO-AD1064', 'CO-AD1092', 'CO-AD1074', 'CO-CN1022', 'CO-CN1034', 'CO-CN0020', 'CO-CN1040', 'CO-CN1027', 'CO-CN1028', 'CO-CN1038', 'CO-ES1009', 'CO-ES1010', 'CO-ES1011', 'CO-ES1012', 'CO-ES1013', 'CO-ES1022', 'CO-ES1024', 'CO-ES1037', 'CO-ES0032', 'CO-ES0035', 'CO-ES0036', 'CO-DS1060', 'CO-DS1004', 'CO-DS1040', 'CO-DS1059', 'CO-DS0003', 'CO-DS0044', 'CO-DS1005', 'CO-DS1042', 'CO-DS0035', 'CO-DS1007', 'CO-DS1061', 'CO-DS0002', 'CO-DS1057'
    );`

    const getProjectsByTeamIds = (data, team_ids) => `SELECT title, ${data}_projects.pid ,  abstract , domain, mode FROM ${data}_projects INNER JOIN ${data}_group_info ON ${data}_projects.pid = ${data}_group_info.pid WHERE ${data}_projects.pid IN (${team_ids});`

    const getProject = ({ event_name, pid }) => `SELECT title, ${event_name}_projects.pid ,  abstract , domain, mode FROM ${event_name}_projects INNER JOIN ${event_name}_group_info ON ${event_name}_projects.pid = ${event_name}_group_info.pid WHERE ${event_name}_projects.pid IN (${pid});`

    const updateProject = (data) => `UPDATE _projects INNER JOIN ${data.event_name}_group_info ON ${data.event_name}_projects.pid = ${data.event_name}_group_info.pid SET ${data.event_name}_projects.title = :title, ${data.event_name}_projects.abstract = :abstract, ${data.event_name}_group_info.mode = :mode WHERE ${data.event_name}_projects.pid = :pid;`


    const getProjectAbstractQ = (pid, event_name) => {
        return `SELECT title, abstract FROM ${event_name}_projects where pid = '${pid}'`;
    }

    const updateProjectAbstractQ = (event_name, pid, abstract) => {
        const escapedAbstract = abstract.replace(/'/g, "\\'").replace(/"/g, '\\"');
        return `UPDATE \`${event_name}_projects\` SET abstract = '${escapedAbstract}' where pid = '${pid}' ;`
    };

    const getBackups = () => {
        return `SELECT t.pid, t.step_1, t.step_2, step_3
        FROM inc_2024.tickets t where t.pid = "IM-ML0056"`
    }

    const getTechfiestaMembers = () => {
        return `CALL getTechfiestaMembers(?)`;
    }

    const getAllTicketsCountForBackup = () => {
        return 'SELECT COUNT(*) AS total FROM tickets WHERE date > ?';
    }

    const getAllTicketsForBackup = () => {
        return 'SELECT * FROM tickets WHERE date > ? ORDER BY date LIMIT ? OFFSET ?';
    }

    return {
        checkUserRegistration,
        completeRegistration,
        insertPICT,
        insertImpetusPICT,
        getRegistrations,
        getProjects,
        getProjectAbstractQ,
        updateProjectAbstractQ,
        getProject,
        updateProject,
        getBackups,
        getTechfiestaMembers,
        getAllTicketsCountForBackup,
        getAllTicketsForBackup,
        getProjectsByTeamIds,

    }
}

export { eventsQueries }