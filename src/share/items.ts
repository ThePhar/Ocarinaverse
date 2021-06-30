export default class Items {
  public static readonly Empty: Item = { name: "Empty", code: 0xff };

  public static readonly DekuSticks: ItemWithAmount = { name: "Deku Sticks", code: 0x00, address: 0x11a5d0 + 0x8c };
  public static readonly DekuNuts: ItemWithAmount = { name: "Deku Nuts", code: 0x01, address: 0x11a5d0 + 0x8d };
  public static readonly Bombs: ItemWithAmount = { name: "Bombs", code: 0x02, address: 0x11a5d0 + 0x8e };
  public static readonly Bow: ItemWithAmount = { name: "Fairy Bow", code: 0x03, address: 0x11a5d0 + 0x8f };
  public static readonly FireArrows: Item = { name: "Fire Arrows", code: 0x04 };
  public static readonly DinsFire: Item = { name: "Din's Fire", code: 0x05 };
  public static readonly Slingshot: ItemWithAmount = { name: "Fairy Slingshot", code: 0x06, address: 0x11a5d0 + 0x92 };
  public static readonly FairyOcarina: Item = { name: "Fairy Ocarina", code: 0x07 };
  public static readonly OcarinaOfTime: Item = { name: "Ocarina of Time", code: 0x08 };
  public static readonly Bombchus: ItemWithAmount = { name: "Bombchus", code: 0x09, address: 0x11a5d0 + 0x94 };
  public static readonly Hookshot: Item = { name: "Hookshot", code: 0x0a };
  public static readonly Longshot: Item = { name: "Longshot", code: 0x0b };
  public static readonly IceArrows: Item = { name: "Ice Arrows", code: 0x0c };
  public static readonly FaroresWind: Item = { name: "Farore's Wind", code: 0x0d };
  public static readonly Boomerang: Item = { name: "Boomerang", code: 0x0e };
  public static readonly LensOfTruth: Item = { name: "Lens of Truth", code: 0x0f };
  public static readonly MagicBeans: ItemWithAmount = { name: "Magic Beans", code: 0x10, address: 0x11a5d0 + 0x9a };
  public static readonly Hammer: Item = { name: "Megaton Hammer", code: 0x11 };
  public static readonly LightArrows: Item = { name: "Light Arrows", code: 0x12 };
  public static readonly NayrusLove: Item = { name: "Nayru's Love", code: 0x13 };

  public static readonly EmptyBottle: BottleItem = { name: "Empty Bottle", code: 0x14 };
  public static readonly RedPotion: BottleItem = { name: "Red Potion", code: 0x15 };
  public static readonly GreenPotion: BottleItem = { name: "Green Potion", code: 0x16 };
  public static readonly BluePotion: BottleItem = { name: "Blue Potion", code: 0x17 };
  public static readonly BottledFairy: BottleItem = { name: "Bottled Fairy", code: 0x18 };
  public static readonly Fish: BottleItem = { name: "Fish", code: 0x19 };
  public static readonly LonLonMilk: BottleItem = { name: "Lon Lon Milk", code: 0x1a };
  public static readonly Letter: BottleItem = { name: "Letter", code: 0x1b };
  public static readonly BlueFire: BottleItem = { name: "Blue Fire", code: 0x1c };
  public static readonly Bug: BottleItem = { name: "Bug", code: 0x1d };
  public static readonly BigPoe: BottleItem = { name: "Big Poe", code: 0x1e };
  public static readonly LonLonMilkHalf: BottleItem = { name: "Lon Lon Milk (Half)", code: 0x1f };
  public static readonly Poe: BottleItem = { name: "Poe", code: 0x20 };

  public static readonly WeirdEgg: Item = { name: "Weird Egg", code: 0x21 };
  public static readonly Chicken: Item = { name: "Chicken", code: 0x22 };
  public static readonly ZeldasLetter: Item = { name: "Zelda's Letter", code: 0x23 };
  public static readonly KeatonMask: Item = { name: "Keaton Mask", code: 0x24 };
  public static readonly SkullMask: Item = { name: "Skull Mask", code: 0x25 };
  public static readonly SpookyMask: Item = { name: "Spooky Mask", code: 0x26 };
  public static readonly BunnyHood: Item = { name: "Bunny Hood", code: 0x27 };
  public static readonly GoronMask: Item = { name: "Goron Mask", code: 0x28 };
  public static readonly ZoraMask: Item = { name: "Zora Mask", code: 0x29 };
  public static readonly GerudoMask: Item = { name: "Gerudo Mask", code: 0x2a };
  public static readonly MaskOfTruth: Item = { name: "Mask of Truth", code: 0x2b };
  public static readonly SoldOut: Item = { name: "Sold Out", code: 0x2c };

  public static readonly PocketEgg: Item = { name: "Pocket Egg", code: 0x2d };
  public static readonly PocketCucco: Item = { name: "Pocket Cucco", code: 0x2e };
  public static readonly Cojiro: Item = { name: "Cojiro", code: 0x2f };
  public static readonly OddMushroom: Item = { name: "Odd Mushroom", code: 0x30 };
  public static readonly OddPotion: Item = { name: "Odd Potion", code: 0x31 };
  public static readonly PoachersSaw: Item = { name: "Poacher's Saw", code: 0x32 };
  public static readonly BrokenGoronSword: Item = { name: "Goron's Sword (Broken)", code: 0x33 };
  public static readonly Prescription: Item = { name: "Prescription", code: 0x34 };
  public static readonly EyeballFrog: Item = { name: "Eyeball Frog", code: 0x35 };
  public static readonly EyeDrops: Item = { name: "Eye Drops", code: 0x36 };
  public static readonly ClaimCheck: Item = { name: "Claim Check", code: 0x37 };
}

export interface Item {
  readonly name: string;
  readonly code: number;
}

export interface ItemWithAmount extends Item {
  readonly address: number;
}

export interface BottleItem extends Item {}
