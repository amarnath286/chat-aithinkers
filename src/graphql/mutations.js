export const chatCustomMessage = /* GraphQL */ `
  mutation ChatCustomMessage($request: CustomAlertInput) {
    chatCustomMessage(request: $request) {
      title
      body
      createdAt
    }
  }
`;
