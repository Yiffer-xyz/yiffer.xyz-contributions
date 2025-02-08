import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { redirectIfNotMod } from '~/utils/loaders';
import {
  create400Json,
  createSuccessJson,
  noGetRoute,
  processApiError,
} from '~/utils/request-helpers';

export { noGetRoute as loader };

export async function action(args: ActionFunctionArgs) {
  await redirectIfNotMod(args);

  const formDataBody = await args.request.formData();
  const formComicName = formDataBody.get('comicName');
  if (!formComicName) return create400Json('Missing comicName');
  const comicName = formComicName.toString();

  const r2 = args.context.cloudflare.env.COMICS_BUCKET;

  try {
    const files = await r2.list({
      prefix: `${comicName}/`,
    });
    const files2 = await r2.list({
      prefix: `${comicName}`,
    });

    const files1Json = JSON.stringify(files);
    const files2Json = JSON.stringify(files2);

    const obj1 = files.objects.map(o => ({
      key: o.key,
      size: o.size,
    }));

    const obj2 = files2.objects.map(o => ({
      key: o.key,
      size: o.size,
    }));

    return createSuccessJson({ files1Json, files2Json, obj1, obj2 });
  } catch (err: any) {
    return processApiError('Error in /list-comic-files', err, { comicName });
  }
}
