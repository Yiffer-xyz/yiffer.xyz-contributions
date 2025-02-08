import { FaRegFile } from 'react-icons/fa';
import type { Comic } from '~/types/types';
import LoadingButton from '~/ui-components/Buttons/LoadingButton';
import { useGoodFetcher } from '~/utils/useGoodFetcher';

export default function ComicFileManager({
  comic,
  imagesServerUrl,
  blockActions,
}: {
  comic: Comic;
  imagesServerUrl: string;
  blockActions?: boolean;
}) {
  const listFilesFetcher = useGoodFetcher<{
    files1Json: string;
    files2Json: string;
    obj1: { key: string; size: number }[];
    obj2: { key: string; size: number }[];
  }>({
    url: '/api/admin/list-comic-files',
    method: 'post',
    toastError: true,
  });

  async function onSubmit() {
    const formData = new FormData();
    formData.append('comicName', comic.name);
    listFilesFetcher.submit(formData);
  }

  return (
    <>
      <LoadingButton
        text="Show comic files"
        className="mt-1"
        onClick={onSubmit}
        startIcon={FaRegFile}
        isLoading={listFilesFetcher.isLoading}
        disabled={blockActions}
      />

      <p>her eit is:</p>
      <p>{JSON.stringify(listFilesFetcher.data, null, 2)}</p>
      {listFilesFetcher.data?.files1Json && (
        <p className="mt-4">{listFilesFetcher.data.files1Json}</p>
      )}
      {listFilesFetcher.data?.files2Json && (
        <p className="mt-4">{listFilesFetcher.data.files2Json}</p>
      )}

      <p className="mt-4">obj1</p>
      <p>{JSON.stringify(listFilesFetcher.data?.obj1, null, 2)}</p>
      <p className="mt-4">obj2</p>
      <p>{JSON.stringify(listFilesFetcher.data?.obj2, null, 2)}</p>
    </>
  );
}
