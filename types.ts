declare global {
  // Extend PrismaJson namespace to include RouteStyleType
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type RouteStyleType = {
      color?: string;
    };

    type PlaceExtendedMetadataType = {
        address?: string;
        text?: { title: string; text: string; attributionUrl: string; };
        images?: { id: string; url: string; width: number; height: number; category?: string; }[];
        categoryId?: string;
        categoryName?: string;
    }

    type PinStyleType = {
      iconId?: string;
      iconColor?: string;
    }
  }
}

// This file must be a module.
export {};
