export const formatDate = date => {
  return new Date(date).toString().substring(4, 15);
};

export const tableRevisionHeaderCells = [
  { id: 1, label: "Date", value: "created_at", isSortable: true },
  { id: 2, label: "User", value: "user", isSortable: true },
  { id: 3, label: "Key", value: "key", isSortable: true },
  { id: 4, label: "New value", value: "new_value", isSortable: false },
  {
    id: 5,
    label: "Old value",
    value: "old_value",
    isSortable: false
  }
];

export const playlistHistoryMock = [
  {
    id: 1,
    date: new Date().toString(),
    user: "Anton Belyankin",
    key: "status",
    new_value: "Draft",
    old_value: "Uploading"
  },
  {
    id: 2,
    date: new Date().toString(),
    user: "Anton Belyankin",
    key: "status",
    new_value: "Uploading",
    old_value: "Draft"
  },
  {
    id: 3,
    date: new Date().toString(),
    user: "Tim Kelly",
    key: "status",
    new_value: "Draft",
    old_value: "Uploading"
  }
];
