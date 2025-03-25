import * as queryService from '../services/queryService.js';

export const getAllQueries = async (req, res) => {
  try {
    const queries = await queryService.getAllQueries();
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQueryById = async (req, res) => {
  try {
    const query = await queryService.getQueryById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const query = await queryService.updateQueryStatus(req.params.id, status);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createQuery = async (req, res) => {
    try {
      const query = await queryService.createQuery(req.body);
      res.status(201).json(query);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };