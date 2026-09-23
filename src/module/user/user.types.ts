export type FindUserParams = {
  userIds?: string[];
  phones?: string[];
  logins?: string[];
  take?: number;
  skip?: number;
};

export type CheckExistUserParams = {
  phone: string;
  login: string;
};