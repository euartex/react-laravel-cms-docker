export const formatDate = date => {
  return new Date(date).toString().substring(4, 15);
};

export const mockedAssets = [
  {
    id: 1,
    title: "AAA",
    project: { id: 1, name: "Alfonso Rachel" },
    company: { id: 1, name: "Alfonso Rachel" },
    created_at: new Date().toString(),
    start_date: new Date().setDate(new Date().getDate() + 1).toString(),
    end_date: new Date().setDate(new Date().getDate() + 3).toString(),
    description: "Lorem ipsum dolor sit amet.",
    VDMS: "https://test.com",
    status: "draft",
    email: "admin@test.com",
    taxNumber: "1234567",
    autoPublish: false,
    logo: ""
  },
  {
    id: 2,
    title: "BBB",
    project: { id: 1, name: "Americas Voice" },
    company: { id: 1, name: "America's Voice" },
    created_at: new Date().toString(),
    start_date: new Date().setDate(new Date().getDate() + 2).toString(),
    end_date: new Date().setDate(new Date().getDate() + 4).toString(),
    description: "Lorem ipsum dolor sit amet.",
    VDMS: "https://test.com",
    status: "published",
    email: "harry@gvpdigitalmedia.com",
    taxNumber: "123456789",
    autoPublish: true,
    logo: ""
  }
  // {
  //   id: 3,
  //   title: "CCC",
  //   project: { id: 1, name: "Ryan Kilgore Music" },
  //   company: { id: 1, name: "OMG" },
  //   created_at: new Date(),
  //   start_date: new Date().setDate(new Date().getDate() + 2),
  //   end_date: new Date().setDate(new Date().getDate() + 3),
  //   description: "Lorem ipsum dolor sit amet.",
  //   VDMS: "https://test.com",
  //   status: "draft",
  //   email: "iraTest@test.com",
  //   taxNumber: "123456789",
  //   autoPublish: true,
  //   logo: ""
  // },
  // {
  //   id: 4,
  //   title: "DDD",
  //   project: { id: 1, name: "Rhythm & Christian - R&C" },
  //   company: { id: 1, name: "Rhythm" },
  //   created_at: new Date(),
  //   start_date: new Date().setDate(new Date().getDate() + 1),
  //   end_date: new Date().setDate(new Date().getDate() + 3),
  //   description: "Lorem ipsum dolor sit amet.",
  //   VDMS: "https://test.com",
  //   status: "uploaded",
  //   email: "iraTest@test.com",
  //   taxNumber: "123456789",
  //   autoPublish: false,
  //   logo: ""
  // },
  // {
  //   id: 5,
  //   title: "EEE",
  //   project: { id: 1, name: "Marvin Mumford Music" },
  //   company: { id: 1, name: "Marvin" },
  //   created_at: new Date(),
  //   start_date: new Date().setDate(new Date().getDate() + 1),
  //   end_date: new Date().setDate(new Date().getDate() + 3),
  //   description: "Lorem ipsum dolor sit amet.",
  //   VDMS: "https://test.com",
  //   status: "draft",
  //   email: "iraTest@test.com",
  //   taxNumber: "123456789",
  //   autoPublish: false,
  //   logo: ""
  // },
  // {
  //   id: 6,
  //   title: "Americas voice live",
  //   project: { id: 1, name: "GVP Media Group" },
  //   company: { id: 1, name: "GVP" },
  //   created_at: new Date(),
  //   start_date: new Date().setDate(new Date().getDate() + 1),
  //   end_date: new Date().setDate(new Date().getDate() + 3),
  //   description: "Lorem ipsum dolor sit amet.",
  //   VDMS: "https://test.com",
  //   status: "draft",
  //   email: "iraTest@test.com",
  //   taxNumber: "123456789",
  //   autoPublish: true,
  //   logo: ""
  // }
];

export const tableHeaderCells = [
  { id: 1, label: "Title", value: "title", isSortable: true },
  {
    id: 2,
    label: "",
    value: "",
    isSortable: false
  },
  {
    id: 3,
    label: "Created at",
    value: "creation_time_asset",
    isSortable: true
  },
  { id: 4, label: "Start date", value: "start_on", isSortable: true },
  { id: 5, label: "End date", value: "end_on", isSortable: true },
  {
    id: 6,
    label: "Description",
    value: "description",
    isSortable: true
  },
  { id: 7, label: "Project", value: "project_id", isSortable: true },
  { id: 8, label: "Company", value: "company_id", isSortable: true },
  { id: 9, label: "VDMS", value: "vdms_id", isSortable: true },
  { id: 10, label: "", value: "", isSortable: false },
  { id: 11, label: "Status", value: "status", isSortable: true },
  { id: 12, label: "", value: "", isSortable: false }
];

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

export const defaultSorting = "created_at";
export const defaultSortingOrder = "desc";

export const initialAsset = {
  d: 6,
  title: "America's voice live",
  project: "GVP Media Group",
  company: "GVP",
  created_at: new Date(),
  start_date: new Date().setDate(new Date().getDate() + 1),
  end_date: new Date().setDate(new Date().getDate() + 3),
  description: "Lorem ipsum dolor sit amet.",
  VDMS: "https://test.com",
  status: "draft",
  email: "iraTest@test.com",
  taxNumber: "123456789",
  autoPublish: true,
  logo: ""
};

export const assetHistoryMock = [
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
