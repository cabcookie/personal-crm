export const GetProjectQuery = /* GraphQL */ `
  query GetProjects($id: ID!) {
    getProjects(id: $id) {
      project
      accounts {
        items {
          account {
            id
            name
            shortName
            createdAt
            introduction
            introductionJson
            people {
              items {
                personId
              }
            }
            learnings {
              items {
                id
                learnedOn
                createdAt
                learning
              }
            }
            subsidiaries {
              items {
                id
                name
                shortName
                createdAt
                introduction
                introductionJson
                people {
                  items {
                    personId
                  }
                }
                learnings {
                  items {
                    id
                    learnedOn
                    createdAt
                    learning
                  }
                }
                subsidiaries {
                  items {
                    id
                    name
                    shortName
                    createdAt
                    introduction
                    introductionJson
                    people {
                      items {
                        personId
                      }
                    }
                    learnings {
                      items {
                        id
                        learnedOn
                        createdAt
                        learning
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      activities {
        items {
          activity {
            id
            finishedOn
            createdAt
            notes
            notesJson
            noteBlockIds
            noteBlocks {
              items {
                id
                content
                type
                todo {
                  id
                  todo
                  status
                }
              }
            }
            forMeeting {
              topic
              participants {
                items {
                  person {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
