/**
 * Un álbum de fotos de una actividad. Las fotos no están en la web: viven en
 * una carpeta de Google Drive del grupo y aquí solo va el enlace.
 */
export interface Album {
  slug: string;
  titulo: string;
  descripcion: string;
  /** Enlace a la carpeta compartida (https). */
  enlace: string;
}
