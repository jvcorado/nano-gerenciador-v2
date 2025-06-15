// app/api/auth/[...nextauth]/route.ts
export const dynamic = 'force-dynamic'; // <- Isso resolve o erro no build

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
