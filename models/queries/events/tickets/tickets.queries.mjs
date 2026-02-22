import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

const env = process.env

function ticketQueries(tableName) {
    const checkTicket = env.GET_TICKET_DETAILS

    const getMembers = env.GET_MEMBERS_FROM_TICKET

    const getPendingPayments = env.GET_PENDING_PAYMENTS

    const getPayment = env.GET_PAYMENT

    const insertTicket = env.INSERT_TICKET

    const editStepData = (step_no) => `UPDATE ${tableName} SET step_${step_no} = ?, step_no = ? WHERE ticket = ?;`

    const editPaymentAndStep = `UPDATE ${tableName} SET step_no = ?, payment_id = ? WHERE ticket = ?;`

    const saveRegistrationDetails = `CALL saveRegistrationDetails(?, ?, ?, ?, ?)`;

    const checkPaymentIdExist = `SELECT payment_id FROM ${tableName} WHERE payment_id = ?`;

    const getIncompleteRegistrations = `CALL getIncompleteRegistrations(?);`

    // const deleteMemberDetailsFromTicket = `UPDATE tickets
    // SET step_2 = JSON_REMOVE(step_2, ${index})
    // WHERE ticket = ?;`

    return {
        checkTicket,
        getMembers,
        getPendingPayments,
        getPayment,
        insertTicket,
        editStepData,
        editPaymentAndStep,
        saveRegistrationDetails,
        checkPaymentIdExist,
        getIncompleteRegistrations,

        // deleteMemberDetailsFromTicket
    }
}

export { ticketQueries }