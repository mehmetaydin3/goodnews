import { getDb } from './db.js';

async function verify() {
  const db = await getDb();
  
  const musician = await db.get('SELECT * FROM musicians LIMIT 1');
  console.log('Musician Check:', {
    hasHeadline: !!musician.headline,
    hasRatingAverage: !!musician.ratingAverage,
    hascompletedJobs: !!musician.completedJobs,
    headline: musician.headline
  });

  const services = await db.all('SELECT * FROM services WHERE musicianId = ?', musician.id);
  console.log('Services Check:', {
    count: services.length,
    firstServiceTitle: services[0]?.title
  });

  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
