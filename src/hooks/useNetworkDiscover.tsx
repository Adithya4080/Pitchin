// import { useQuery } from '@tanstack/react-query';
// import { getNetworkDiscover, NetworkTab } from '@/api/profiles';

// // ─── Static fallback data — shows while backend is not yet deployed ───────────
// const FALLBACK: Record<NetworkTab, any[]> = {
//   investor: [
//     {
//       id: 1, user_id: 1, name: 'Sequoia Capital', role: 'investor',
//       role_label: 'VC Firm', org_name: 'Sequoia Capital', avatar: null,
//       bio: 'Investing in visionary founders building category-defining companies.',
//       tags: ['Early Stage', 'Series A+'], is_verified: true,
//       location: 'San Francisco, USA', website: 'https://sequoiacap.com',
//     },
//     {
//       id: 2, user_id: 2, name: 'Y Combinator', role: 'investor',
//       role_label: 'Accelerator', org_name: 'Y Combinator', avatar: null,
//       bio: 'Helping founders build something people want.',
//       tags: ['Pre-Seed', 'Seed Stage'], is_verified: true,
//       location: 'Mountain View, USA', website: 'https://ycombinator.com',
//     },
//     {
//       id: 3, user_id: 3, name: 'Accel Partners', role: 'investor',
//       role_label: 'VC Firm', org_name: 'Accel', avatar: null,
//       bio: 'Backing exceptional teams from inception to market leadership.',
//       tags: ['Seed Stage', 'Series B+'], is_verified: true,
//       location: 'Palo Alto, USA', website: 'https://accel.com',
//     },
//     {
//       id: 4, user_id: 4, name: 'Andreessen Horowitz', role: 'investor',
//       role_label: 'VC Firm', org_name: 'a16z', avatar: null,
//       bio: 'Building the future with bold entrepreneurs and category-defining companies.',
//       tags: ['Seed Stage', 'Growth'], is_verified: true,
//       location: 'Menlo Park, USA', website: 'https://a16z.com',
//     },
//   ],
//   mentor: [
//     {
//       id: 5, user_id: 5, name: 'Priya Sharma', role: 'consultant',
//       role_label: 'Mentor', org_name: '', avatar: null,
//       bio: 'Ex-Google product leader. Helping early-stage founders find product-market fit.',
//       tags: ['Product', 'GTM Strategy'], is_verified: true,
//       location: 'Bangalore, India', website: '',
//     },
//     {
//       id: 6, user_id: 6, name: 'Rajiv Menon', role: 'consultant',
//       role_label: 'Mentor', org_name: '', avatar: null,
//       bio: '3x founder, 1 exit. Mentoring SaaS and B2B startups on growth and fundraising.',
//       tags: ['SaaS', 'Fundraising'], is_verified: true,
//       location: 'Mumbai, India', website: '',
//     },
//     {
//       id: 7, user_id: 7, name: 'Aisha Patel', role: 'consultant',
//       role_label: 'Mentor', org_name: '', avatar: null,
//       bio: 'Marketing expert with 15 years helping startups scale from zero to one.',
//       tags: ['Marketing', 'Brand'], is_verified: false,
//       location: 'Delhi, India', website: '',
//     },
//     {
//       id: 8, user_id: 8, name: 'Sanjay Kumar', role: 'consultant',
//       role_label: 'Mentor', org_name: '', avatar: null,
//       bio: 'CTO turned mentor. Deep expertise in tech architecture and engineering teams.',
//       tags: ['Tech', 'Engineering'], is_verified: true,
//       location: 'Hyderabad, India', website: '',
//     },
//   ],
//   partner: [
//     {
//       id: 9, user_id: 9, name: 'TechStars India', role: 'ecosystem_partner',
//       role_label: 'Partner', org_name: 'TechStars India', avatar: null,
//       bio: 'Connecting startups to a global network of mentors, investors, and partners.',
//       tags: ['Early Stage', 'Global'], is_verified: true,
//       location: 'Bangalore, India', website: '',
//     },
//     {
//       id: 10, user_id: 10, name: 'NASSCOM', role: 'ecosystem_partner',
//       role_label: 'Partner', org_name: 'NASSCOM', avatar: null,
//       bio: 'India\'s premier tech industry body supporting startup growth and innovation.',
//       tags: ['Tech', 'Policy'], is_verified: true,
//       location: 'New Delhi, India', website: '',
//     },
//     {
//       id: 11, user_id: 11, name: 'iCreate', role: 'ecosystem_partner',
//       role_label: 'Partner', org_name: 'iCreate', avatar: null,
//       bio: 'International Centre for Entrepreneurship and Technology.',
//       tags: ['Deep Tech', 'Manufacturing'], is_verified: true,
//       location: 'Ahmedabad, India', website: '',
//     },
//     {
//       id: 12, user_id: 12, name: 'CIIE.CO', role: 'ecosystem_partner',
//       role_label: 'Partner', org_name: 'CIIE.CO', avatar: null,
//       bio: 'IIM Ahmedabad\'s entrepreneurship platform backing impact startups.',
//       tags: ['Impact', 'Deep Tech'], is_verified: true,
//       location: 'Ahmedabad, India', website: '',
//     },
//   ],
//   accelerator: [
//     {
//       id: 13, user_id: 13, name: '100X.VC', role: 'ecosystem_partner',
//       role_label: 'Accelerator', org_name: '100X.VC', avatar: null,
//       bio: 'India\'s first iSAFE note based VC fund for early stage Indian startups.',
//       tags: ['Pre-Seed', 'India'], is_verified: true,
//       location: 'Mumbai, India', website: '',
//     },
//     {
//       id: 14, user_id: 14, name: 'Surge by Sequoia', role: 'ecosystem_partner',
//       role_label: 'Accelerator', org_name: 'Surge', avatar: null,
//       bio: 'Rapid scale-up program for startups in India and Southeast Asia.',
//       tags: ['Seed', 'Series A'], is_verified: true,
//       location: 'Bangalore, India', website: '',
//     },
//     {
//       id: 15, user_id: 15, name: 'Antler India', role: 'ecosystem_partner',
//       role_label: 'Accelerator', org_name: 'Antler', avatar: null,
//       bio: 'Pre-idea to Series A. Building and investing in the defining companies of tomorrow.',
//       tags: ['Pre-Idea', 'Pre-Seed'], is_verified: true,
//       location: 'Bangalore, India', website: '',
//     },
//     {
//       id: 16, user_id: 16, name: 'GSF Accelerator', role: 'ecosystem_partner',
//       role_label: 'Accelerator', org_name: 'GSF', avatar: null,
//       bio: 'Helping startups build for global markets from India.',
//       tags: ['Seed', 'Global'], is_verified: false,
//       location: 'Bangalore, India', website: '',
//     },
//   ],
//   community: [
//     {
//       id: 17, user_id: 17, name: 'iSPIRT Foundation', role: 'ecosystem_partner',
//       role_label: 'Community', org_name: 'iSPIRT', avatar: null,
//       bio: 'Volunteer think-tank transforming India into a product nation.',
//       tags: ['SaaS', 'B2B'], is_verified: true,
//       location: 'Bangalore, India', website: '',
//     },
//     {
//       id: 18, user_id: 18, name: 'SaaSBoomi', role: 'ecosystem_partner',
//       role_label: 'Community', org_name: 'SaaSBoomi', avatar: null,
//       bio: 'Largest SaaS community in India. Pay it forward ecosystem.',
//       tags: ['SaaS', 'Enterprise'], is_verified: true,
//       location: 'Chennai, India', website: '',
//     },
//     {
//       id: 19, user_id: 19, name: 'Headstart Network', role: 'ecosystem_partner',
//       role_label: 'Community', org_name: 'Headstart', avatar: null,
//       bio: 'Community of early-stage entrepreneurs. Largest startup community in India.',
//       tags: ['Early Stage', 'Pan-India'], is_verified: true,
//       location: 'Pan India', website: '',
//     },
//     {
//       id: 20, user_id: 20, name: 'TiE Global', role: 'ecosystem_partner',
//       role_label: 'Community', org_name: 'TiE', avatar: null,
//       bio: 'The Indus Entrepreneurs — global community of entrepreneurs and professionals.',
//       tags: ['Global', 'Mentorship'], is_verified: true,
//       location: 'Global', website: '',
//     },
//   ],
// };

// export function useNetworkDiscover(params: {
//   tab?: NetworkTab;
//   search?: string;
//   stage?: string;
//   page?: number;
//   enabled?: boolean;
// }) {
//   const { enabled = true, ...queryParams } = params;
//   return useQuery({
//     queryKey: ['network-discover', params],
//     queryFn: async () => {
//       try {
//         const data = await getNetworkDiscover({ ...params, page_size: 8 });
//         // If backend returns results, use them; otherwise fallback
//         if (data?.results?.length > 0) return data;
//         throw new Error('empty');
//       } catch {
//         // Return fallback static data shaped like the API response
//         const tab = params.tab ?? 'investor';
//         const results = FALLBACK[tab] ?? FALLBACK.investor;
//         return {
//           results,
//           count: results.length,
//           num_pages: 1,
//           page: 1,
//         };
//       }
//     },
//     enabled,
//     staleTime: 1000 * 60 * 2,
//   });
// }