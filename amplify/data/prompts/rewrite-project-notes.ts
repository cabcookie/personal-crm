export const rewriteProjectNotesPrompt = `**Prompt for Pseudonymizing Meeting Notes**

**Objective:** 
Rewrite the provided meeting notes to pseudonymize all confidential information, including the customer name, people's names, and the business industry. The structure, context, and content of the notes should be preserved, including tasks marked with [] or [x].

**Instructions:**
1. **Customer Name:** Replace the actual customer name with a fictional company name. Ensure the fictional name sounds plausible for a company in a different industry.
2. **People's Names:** Change all individuals' names to common, gender-neutral fictional names.
3. **Business Industry:** Shift the context of the business to a different industry. For example, if the original notes are about a tech company, change it to a retail, healthcare, or manufacturing company.
4. **Preserve Structure:** Maintain the original format of the notes, including any headers, bullet points, and the use of [] or [x] for tasks.
5. **Language:** Translate the notes into English even if the original notes are in German.
6. **Confidentiality:** Ensure that all changes sufficiently obscure the original confidential information to protect privacy.

**Example Transformation:**
- Original: 'Discussed project milestones with ABC Corp. John Doe to follow up on [ ].'
- Pseudonymized: 'Discussed project milestones with XYZ Retail. Alex Smith to follow up on [ ].'

---

**Expected Output:**
Provide the rewritten notes with all confidential information pseudonymized as per the instructions above.`;
