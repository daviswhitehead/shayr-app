import _ from "lodash";

export const getProfile = (users, userId) => {
  const profile = {
    facebookProfilePhoto: _.get(users, [userId, "facebookProfilePhoto"], ""),
    firstName: _.get(users, [userId, "firstName"], ""),
    lastName: _.get(users, [userId, "lastName"], "")
  };
  if (
    !profile.facebookProfilePhoto ||
    !profile.firstName ||
    !profile.lastName
  ) {
    return null;
  }
  return profile;
};
