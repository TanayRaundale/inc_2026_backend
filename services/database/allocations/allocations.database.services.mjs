import { allocationQueries } from "../../../models/index.js";
import { AppError } from "../../../utils/index.js";

function allocationServices(db) {
    const getLabs = async (event_name) => {
        try {
            // Get all pids and their associated jids from the allocation table for day 1
            const allocationQuery1 = `
                SELECT pid, GROUP_CONCAT(jid) AS jids 
                FROM allocations 
                WHERE jid LIKE 'CO-%' 
                  AND (JSON_CONTAINS(slots, '["4"]') OR JSON_CONTAINS(slots, '["5"]') OR JSON_CONTAINS(slots, '["6"]')) 
                GROUP BY pid;
            `;
            const [allocationResults1] = await db.execute(allocationQuery1).catch(err => {
                throw new AppError(400, 'fail', err.sqlMessage);
            });

            // Get all projects from _projects table for the given event_name
            const projectsQuery = `SELECT pid, title, lab FROM ${event_name}_projects;`;
            const [projectsResults] = await db.execute(projectsQuery).catch(err => {
                throw new AppError(400, 'fail', err.sqlMessage);
            });

            // Append jids to each project for day 1
            const projectsWithJids= projectsResults.map(project => {
                const { pid } = project;
                const allocation = allocationResults1.find(a => a.pid === pid);
                const jids = allocation ? allocation.jids.split(',') : [];
                return { ...project, jids };
            });

            return  projectsWithJids;
        } catch (err) {
            throw err;
        }
    };




    async function updateLab(event_name, data) {
        try {
            const preparedArray = [data.lab, ...data.pids]
            const [results] = await db.execute(allocationQueries.updateLab(event_name, data), preparedArray).catch(err => {
                throw new AppError(400, 'fail', err.sqlMessage)
            })
            return results[0]
        } catch (err) {
            throw err
        }
    }

    async function allocate(event_name, data) {
        try {
            const [results] = await db.execute(allocationQueries.allocate(event_name, data.pids, data.jids, data.slots)).catch(err => {
                throw new AppError(400, 'fail', err.sqlMessage)
            })
            return results[0]
        } catch (err) {
            throw err
        }
    }

    async function deallocate(event_name, data) {
        try {
            const [results] = await db.execute(allocationQueries.deallocate(event_name, data.pids, data.jids)).catch(err => {
                throw new AppError(400, 'fail', err.sqlMessage)
            })
            return results[0]
        } catch (err) {
            throw err
        }
    }

    async function evalStats(event_name) {
        try {
            let pid;
            if (event_name === 'impetus') pid = "IM-%";
            else pid = "CO-%";
            const [results] = await db.execute(allocationQueries.getEvalStats(event_name, pid)).catch(err => {
                throw new AppError(400, 'fail', err.sqlMessage);
            });
            return results;
        } catch (err) {
            throw err;
        }
    }

    async function deallocate(event_name, data) {
        try {
            const [results] = await db.execute(allocationQueries.deallocate(event_name, data.pids, data.jids)).catch(err => {
                throw new AppError(400, 'fail', err.sqlMessage)
            })
            return results[0]
        } catch (err) {
            throw err
        }
    }

    return {
        getLabs,
        updateLab,
        allocate,
        deallocate,
        evalStats
    }
}

export default allocationServices;