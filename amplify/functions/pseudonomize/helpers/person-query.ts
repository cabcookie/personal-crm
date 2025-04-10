export const GetPersonQuery = /* GraphQL */ `
  query GetPerson($id: ID!) {
    getPerson(id: $id) {
      id
      name
      learnings {
        items {
          id
          learnedOn
          createdAt
          learning
        }
      }
      accounts {
        items {
          startDate
          endDate
          position
          account {
            id
            name
          }
        }
      }
    }
  }
`;
