// utils/group.ts
export function userInGroup(groups: any, groupName: String) {
  return groups.some((g: IGroupInfo) => g.name === groupName);
}
export function filterMenuByAccess(menu: any[], access: string[]): any {
  return menu
    .map((item) => {
      if (item.path) {
        return access.includes(item.path) ? item : null;
      }

      if (item.sub_menu) {
        const filteredSub = filterMenuByAccess(item.sub_menu, access);
        if (filteredSub.length > 0) {
          return { ...item, sub_menu: filteredSub };
        }
      }

      return null;
    })
    .filter(Boolean);
}
