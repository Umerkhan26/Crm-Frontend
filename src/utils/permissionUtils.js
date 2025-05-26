export const hasPermission = (user, module, action) => {
  if (!user || !user.permissions) return false;

  // Example: permissions = { campaign: { read: true, create: false, update: false, delete: true } }
  return user.permissions[module]?.[action] === true;
};
