// Renders no translations. Fails the build if anything in the tree is dynamic.
export const dynamic = 'error';

export default async function Probe() {
  return <div>probe</div>;
}
