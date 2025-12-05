import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = 'http://localhost:3001';
const TMDB_IDS_FILE = path.join(__dirname, 'tmdb_ids.json');

interface ImportResult {
  tmdbId: number;
  success: boolean;
  error?: string;
}

async function importMovie(tmdbId: number): Promise<ImportResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/movies/${tmdbId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        tmdbId,
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.log(`✅ Successfully imported movie: ${data.data?.title || tmdbId}`);
    return { tmdbId, success: true };
  } catch (error) {
    return {
      tmdbId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function importAllMovies() {
  console.log('🎬 Starting TMDB movie import...\n');

  // Read TMDB IDs from JSON file
  const tmdbIds: number[] = JSON.parse(fs.readFileSync(TMDB_IDS_FILE, 'utf-8'));
  console.log(`📋 Found ${tmdbIds.length} TMDB IDs to import\n`);

  const results: ImportResult[] = [];
  let successCount = 0;
  let failCount = 0;

  // Import movies sequentially to avoid rate limiting
  for (let i = 0; i < tmdbIds.length; i++) {
    const tmdbId = tmdbIds[i];
    console.log(`[${i + 1}/${tmdbIds.length}] Importing TMDB ID: ${tmdbId}...`);

    const result = await importMovie(tmdbId);
    results.push(result);

    if (result.success) {
      successCount++;
    } else {
      failCount++;
      console.error(`❌ Failed to import ${tmdbId}: ${result.error}`);
    }

    // Add a small delay to avoid overwhelming the server
    if (i < tmdbIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successful imports: ${successCount}`);
  console.log(`❌ Failed imports: ${failCount}`);
  console.log(`📝 Total processed: ${tmdbIds.length}`);
  console.log('='.repeat(50) + '\n');

  // Print failed imports if any
  const failedImports = results.filter(r => !r.success);
  if (failedImports.length > 0) {
    console.log('Failed TMDB IDs:');
    failedImports.forEach(f => {
      console.log(`  - ${f.tmdbId}: ${f.error}`);
    });
  }
}

// Run the import
importAllMovies().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
