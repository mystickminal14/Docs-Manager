import APIClient from "../../../services/apiClient";

import type { ManageModel }  from "../models/ManageModel";

export const ManageEndpoint = new APIClient<ManageModel>('/classroutine');