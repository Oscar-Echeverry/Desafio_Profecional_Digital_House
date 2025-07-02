import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as BiIcons from 'react-icons/bi';
import * as RiIcons from 'react-icons/ri';
import * as HiIcons from 'react-icons/hi';

const iconLibraries = {
  Fa: FaIcons,
  Md: MdIcons,
  Gi: GiIcons,
  Ai: AiIcons,
  Bs: BsIcons,
  Bi: BiIcons,
  Ri: RiIcons,
  Hi: HiIcons,
};

export function getIconComponent(iconName) {
  if (!iconName || typeof iconName !== 'string') return null;

  const prefix = iconName.slice(0, 2); 
  const iconSet = iconLibraries[prefix];

  if (!iconSet) return null;

  return iconSet[iconName] || null;
}
