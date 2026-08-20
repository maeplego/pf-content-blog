export default function LoggedOutPage() {
  return (
    <main>
      <h1>ログアウトしました</h1>
      <p className="muted">
        <a href="/login">再ログイン</a>できます。
      </p>
    </main>
  );
}
