import axios from 'axios';
import queryString from 'query-string';
import { TaxInterface, TaxGetQueryInterface } from 'interfaces/tax';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getTaxes = async (query?: TaxGetQueryInterface): Promise<PaginatedInterface<TaxInterface>> => {
  const response = await axios.get('/api/taxes', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createTax = async (tax: TaxInterface) => {
  const response = await axios.post('/api/taxes', tax);
  return response.data;
};

export const updateTaxById = async (id: string, tax: TaxInterface) => {
  const response = await axios.put(`/api/taxes/${id}`, tax);
  return response.data;
};

export const getTaxById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/taxes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTaxById = async (id: string) => {
  const response = await axios.delete(`/api/taxes/${id}`);
  return response.data;
};
