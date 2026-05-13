export const ROLE_PERMISSIONS = {
  ADMIN: {
    roles: { add: true, edit: true, view: true, delete: true },
    users: { add: true, edit: true, view: true, delete: true },
  },
  USER: {
    roles: { add: false, edit: false, view: false, delete: false },
    users: { add: false, edit: false, view: false, delete: false },
  },
};
