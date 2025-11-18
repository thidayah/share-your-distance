export interface ContactMessagesCreate {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export interface ContactMessagesUpdate extends Partial<ContactMessagesCreate> {
  id: string;
}