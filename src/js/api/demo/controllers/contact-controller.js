export class ContactController {
  contact(body) {
    console.log(`Received message "${body.message}" from ${body.name} <${body.email}>`);
  }
};
