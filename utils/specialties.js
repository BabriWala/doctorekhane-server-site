const groups = [
  ['Cardiology', 'cardiolog', 'cardiologist'],
  ['Dermatology', 'dermatolog', 'dermatologist'],
  ['Endocrinology', 'endocrinolog', 'endocrinologist'],
  ['Gastroenterology', 'gastroenterolog', 'gastroenterologist'],
  ['Neurology', 'neurolog', 'neurologist'],
  ['Nephrology', 'nephrolog', 'nephrologist'],
  ['Urology', 'urolog', 'urologist'],
  ['Oncology', 'oncolog', 'oncologist'],
  ['Psychiatry', 'psychiatr', 'phychiatr'],
  ['Pediatrics', 'pediatr', 'paediatr'],
  ['Gynecology & Obstetrics', 'gynecol', 'gynaecol', 'obstetric'],
  ['Orthopedics', 'orthoped', 'orthopaed'],
  ['Ophthalmology', 'ophthalmolog'],
  ['ENT', 'otolaryngolog', 'ear nose throat', 'ent'],
  ['Dentistry', 'dentist', 'dental'],
  ['Pulmonology', 'pulmonolog', 'respiratory medicine'],
  ['Rheumatology', 'rheumatolog'],
];
const fields = ['specialization.field', 'professional.department', 'professional.field'];
const escapeRegex = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const groupFor = value => groups.find(group => group.some(term => new RegExp(`\\b${escapeRegex(term)}`, 'i').test(value)));
const specialtyName = value => groupFor(value)?.[0] || String(value).trim().replace(/\s+/g, ' ');
function specialtyMatch(value) {
  const normalized = String(value).trim().replace(/\s+/g, ' ');
  const group = groupFor(normalized);
  const pattern = group ? `\\b(?:${group.map(escapeRegex).join('|')})` : escapeRegex(normalized).replace(/\s+/g, '\\s+');
  return { $or: fields.map(field => ({ [field]: { $regex: pattern, $options: 'i' } })) };
}
module.exports = { specialtyName, specialtyMatch };
