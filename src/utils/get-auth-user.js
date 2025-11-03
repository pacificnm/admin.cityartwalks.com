export async function getAuthUserId() {
  try {
    const auth = JSON.parse(localStorage.getItem('auth0?:user'));
    return auth?.id || null;
  } catch {
    return null;
  }
}
