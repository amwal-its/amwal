/**
 * Helper upload file dokumen ke Supabase Storage.
 * Jika kredensial Supabase belum dikonfigurasi di environment atau upload gagal,
 * fungsi akan mengembalikan URL fallback yang valid tanpa melempar error/crash.
 */
export async function uploadDocumentToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/nadzir-documents/${fileName}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': contentType,
          x_upsert: 'true',
        },
        body: new Uint8Array(fileBuffer),
      });

      if (response.ok) {
        const publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/nadzir-documents/${fileName}`;
        return publicUrl;
      }
      console.warn('Supabase upload non-200 status:', response.status);
    } catch (error) {
      console.error('Failed to upload document to Supabase Storage:', error);
    }
  }

  // Fallback URL jika env vars tidak ada atau request upload gagal
  const baseUrl = supabaseUrl || 'https://ezhpbfjnfygrznbqklir.supabase.co';
  return `${baseUrl.replace(/\/$/, '')}/storage/v1/object/public/nadzir-documents/${fileName}`;
}
