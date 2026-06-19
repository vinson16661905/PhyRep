import axios from "axios";

import type { Block, ReportMeta } from "../types/blocks";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface TexResponse {
  tex: string;
}

export const requestTex = async (payload: { meta: ReportMeta; blocks: Block[] }) => {
  const { data } = await apiClient.post<TexResponse>("/generate-tex", payload);
  return data;
};

export interface Variable {
  name: string;
  value: number;
  uncertainty: number;
}

export interface UncertaintyCalculationRequest {
  expression: string;
  variables: Variable[];
}

export interface UncertaintyCalculationResponse {
  result_value: number;
  result_uncertainty: number;
}

export const calculateUncertainty = async (payload: UncertaintyCalculationRequest) => {
  const { data } = await apiClient.post<UncertaintyCalculationResponse>("/calculate/uncertainty", payload);
  return { value: data.result_value, uncertainty: data.result_uncertainty };
};
