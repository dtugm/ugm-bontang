// utils/group.ts
export function userInGroup(groups: any, groupName: String) {
  return groups.some((g: IGroupInfo) => g.name === groupName);
}
