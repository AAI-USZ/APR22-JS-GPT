const compareFunc = type === 'monthly'
? (yearA, monthA, yearB, monthB) => yearA === yearB && monthA === monthB
: (yearA, monthA, yearB, monthB) => yearA === yearB;
