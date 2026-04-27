/**
 * SUPABASE REMOVED — this project now uses the Django REST backend.
 * This file is kept as a shim to avoid import errors from legacy components.
 * All actual data fetching is done via src/api/*.ts
 */
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({ error: null }),
  },
  from: (_table: string) => ({
    select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }), then: async () => ({ data: [], error: null }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ then: async () => ({ error: null }) }) }),
    delete: () => ({ eq: () => ({ then: async () => ({ error: null }) }) }),
    upsert: () => ({ then: async () => ({ error: null }) }),
  }),
  storage: {
    from: (_bucket: string) => ({
      upload: async () => ({ error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  channel: (_name: string) => ({
    on: function() { return this; },
    subscribe: () => {},
  }),
  removeChannel: () => {},
  functions: {
    invoke: async (_name: string, _opts?: any) => ({ data: null, error: null }),
  },
};
