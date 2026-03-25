import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5001';

async function testVibe(query: string) {
  console.log(`\nTesting Vibe: "${query}"`);
  try {
    const res = await fetch(`${API_BASE}/api/musicians?vibe=${encodeURIComponent(query)}`);
    const data = await res.json() as any;
    console.log(`Results found: ${data.musicians.length}`);
    data.musicians.slice(0, 3).forEach((m: any) => {
      console.log(`- ${m.name}: ${m.headline}`);
      console.log(`  Genres: ${m.genres.join(', ')}`);
      console.log(`  Instruments: ${m.instruments.join(', ')}`);
    });
  } catch (err) {
    console.error(`Error testing vibe "${query}":`, err);
  }
}

async function runTests() {
  await testVibe('moody cello');
  await testVibe('cinematic intro');
  await testVibe('upbeat pop guitar');
  await testVibe('soulful vocals');
}

runTests();
