import { baseURL } from "./ApisUrls";
import { createHttpClient } from "./Http";

export const http = createHttpClient(baseURL);