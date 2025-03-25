import Query from '../models/Query.model.js';

export const getAllQueries = async () => {
  return await Query.find();
};

export const getQueryById = async (id) => {
  return await Query.findById(id);
};

export const updateQueryStatus = async (id, status) => {
  return await Query.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
};


export const createQuery = async (data) => {
    return await Query.create(data);
  };