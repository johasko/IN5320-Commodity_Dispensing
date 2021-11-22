export function fetchMainDataQuery(){
    return {
        me: {
            resource: "me",
            params: {
            fields: ["name, id, organisationUnits"],
            },
        }
    }
}