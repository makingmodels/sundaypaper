import { Block, BlockType, Issue, User } from '../types';

// Helper to simulate other users in the circle for demo purposes
const SIMULATED_FRIENDS = [
  { name: 'Sarah', content: "Spent the whole weekend gardening. The tomatoes are finally coming in!", image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e10?w=800&q=80" },
  { name: 'Mike', content: "Finally finished the woodshop project. It's not perfect, but it's mine.", image: "https://images.unsplash.com/photo-1603350286221-ca467e411f19?w=800&q=80" },
  { name: 'Jules', content: "Reading 'The Creative Act' by Rick Rubin. Highly recommend for everyone in this circle.", image: null }
];

export const generateCircleCode = (): string => {
  const prefix = ['SUN', 'WKLY', 'FAM', 'CRE', 'ART'];
  const p = prefix[Math.floor(Math.random() * prefix.length)];
  const n = Math.floor(Math.random() * 900) + 100;
  return `${p}-${n}`;
};

export const saveDraft = (user: User, blocks: Block[]) => {
  const key = `sunday_paper_draft_${user.name}_${user.groupCode}`;
  localStorage.setItem(key, JSON.stringify(blocks));
};

export const getDraft = (user: User): Block[] => {
  const key = `sunday_paper_draft_${user.name}_${user.groupCode}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const clearDraft = (user: User) => {
  const key = `sunday_paper_draft_${user.name}_${user.groupCode}`;
  localStorage.removeItem(key);
};

export const getIssues = (circleCode: string): Issue[] => {
  const key = `sunday_paper_issues_${circleCode}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const publishIssue = (user: User, userBlocks: Block[]): Issue => {
  const circleKey = `sunday_paper_issues_${user.groupCode}`;
  const existingIssues: Issue[] = getIssues(user.groupCode);
  
  const weekNum = existingIssues.length + 42; // Start at week 42 for aesthetic
  const issueId = `issue-${Date.now()}`;

  // 1. Create the user's section
  const mySection = {
    userName: user.name,
    blocks: userBlocks
  };

  // 2. Simulate friends (Consolidation Logic)
  // In a real app, this would query the backend for other users' submitted drafts for this week.
  // Here, we inject fake data so the user sees a "Group" newsletter.
  const friendSections = SIMULATED_FRIENDS.map((friend, idx) => {
    const blocks: Block[] = [];
    // Add text
    blocks.push({
      id: `sim-${idx}-text`,
      timestamp: Date.now(),
      type: BlockType.TEXT,
      content: friend.content
    });
    // Add image if exists
    if (friend.image) {
      blocks.push({
        id: `sim-${idx}-img`,
        timestamp: Date.now(),
        type: BlockType.IMAGE,
        url: friend.image,
        caption: "Captured this week"
      });
    }
    return {
      userName: friend.name,
      blocks
    };
  });

  // Combine them (User first, then friends)
  const consolidatedSections = [mySection, ...friendSections];

  const newIssue: Issue = {
    id: issueId,
    circleCode: user.groupCode,
    weekNumber: weekNum,
    publishDate: Date.now(),
    sections: consolidatedSections
  };

  // Save to history
  localStorage.setItem(circleKey, JSON.stringify([newIssue, ...existingIssues]));

  // Clear user's draft
  clearDraft(user);

  return newIssue;
};
