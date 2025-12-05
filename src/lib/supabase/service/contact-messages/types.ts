export interface ContactMessagesCreate {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  is_read?: boolean;
}

export interface ContactMessagesUpdate extends Partial<ContactMessagesCreate> {
  id: string;
}