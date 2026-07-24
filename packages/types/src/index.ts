// Placeholder for types
// Will be expanded in future phases

export type Organization = {
  id: string;
  name: string;
  slug: string;
};

export type Unit = {
  id: string;
  organizationId: string;
  code: string;
  name: string;
};
