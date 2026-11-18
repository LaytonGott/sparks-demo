import { createApi } from './api.ts';

const port = Number(process.env.PORT ?? 3000);
createApi().listen(port, () => console.log(`Task tracker listening on port ${port}`));
