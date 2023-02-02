import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Modal,
  ModalBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  DropdownItem,
  Badge,
} from "reactstrap";
import {
  Button,
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  Row,
  TooltipComponent,
  UserAvatar,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
} from "../../../components/Component";
import Pagination from 'react-bootstrap/Pagination';

import { findUpper } from "../../../utils/Utils";
import { Link } from "react-router-dom";
import axios from 'axios';
import { setChecking } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
let totalData = [];

const Wallet = ({ history }) => {
  const dispatch = useDispatch();
  const admin = useSelector(state => state.user.admin);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [tablesm, updateTableSm] = useState(false);
  const [data, setData] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [detail, setDetail] = useState({});
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(20);
  const [sort, setSortState] = useState("");
  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.email.localeCompare(b.email));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.email.localeCompare(a.email));
      setData([...sortedData]);
    }
  };
  useEffect(() => {
    dispatch(setChecking(true));
    setChecking
    axios.get(`${process.env.REACT_APP_API_SERVER}/api/other/wallets`)
    .then(res => {
      dispatch(setChecking(false));
      setData(res.data);
      totalData = res.data;
    })
    .catch(err => {
      dispatch(setChecking(false));
    })

  }, [])
  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = totalData.filter((item) => {
        return (item.email.toLowerCase().includes(onSearchText.toLowerCase()) || item.tradingAccountId.toLowerCase().includes(onSearchText.toLowerCase()) || item.ethAddress.toLowerCase().includes(onSearchText.toLowerCase()));
      });
      setData([...filteredObject]);
    } else {
      setData([...totalData]);
    }
  }, [onSearchText]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to declare the state change
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // function to select all the items of the table
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function to change the property of an item of the table
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to fire actions after dropdowm select
  const onActionClick = (e) => {
    if (actionText === "Reject") {
      let newData = data.map((item) => {
        if (item.check === true) item.status = "Rejected";
        return item;
      });
      setData([...newData]);
    } else if (actionText === "Delete") {
      let newData;
      newData = data.filter((item) => item.check !== true);
      setData([...newData]);
    }
  };

  // function to change to approve property for an item
  const onApproveClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].status = "Approved";
    console.log(newData);
    setData([...newData]);
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/deposit`, { id, status: "Approved"})
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    })
  };

  // function to change to reject property for an item
  const onRejectClick = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].status = "Rejected";
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/other/deposit`, { id, status: "Rejected" })
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    })
    setData([...newData]);
  };

  // function to load detail data
  const loadDetail = (id) => {
    let index = data.findIndex((item) => item._id === id);
    setDetail(data[index]);
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title="Deposit History"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Trading Accounts</BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} trading accounts.</p>
              </BlockDes>
            </BlockHeadContent>
            {/* <BlockHeadContent>
              <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                <Icon name="download-cloud"></Icon>
                <span>Export</span>
              </Button>
              <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                <Icon name="download-cloud"></Icon>
              </Button>
            </BlockHeadContent> */}
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <Button
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </Button>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-xs">
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li className={itemPerPage === 10 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                    <li className={itemPerPage === 15 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(20);
                                        }}
                                      >
                                        20
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li className={sort === "dsc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("dsc");
                                          sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li className={sort === "asc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("asc");
                                          sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                      className="search-back btn-icon toggle-search"
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by email, address or trading acount id"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow  size="sm">
                  <span>User</span>
                </DataTableRow>
                <DataTableRow size="sm">
                  <span>Trading Account Id</span>
                </DataTableRow>
                <DataTableRow size="sm" style={{ maxWidth: "0px"}}>
                  <span>Address</span>
                </DataTableRow>
                {
                  admin?.role === "Super Admin" && 
                    <DataTableRow size="sm">
                      <span>Private Key</span>
                    </DataTableRow>
                }
                
              </DataTableHead>

              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item._id} >
                        <DataTableRow>
                            <div className="user-card" >
                              <UserAvatar
                                theme={"primary"}
                                text={findUpper(item.email)}
                                image={item.image}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">
                                  {item.email}{" "}
                                  <span
                                    className={`dot dot-${
                                      (item.status === "Approved" || item.status === "DONE" )
                                        ? "success"
                                        : item.status === "Pending"
                                        ? "info"
                                        : "danger"
                                    } d-md-none ml-1`}
                                  ></span>
                                </span>
                                <span>{item.email}</span>
                              </div>
                            </div>
                        </DataTableRow>
                        <DataTableRow >
                          <span className="tb-lead-sub">{ item.tradingAccountId }</span>
                        </DataTableRow>
                        <DataTableRow >
                          <span className="tb-lead-sub" style={{ overflowWrap: "anywhere" }}>{item.ethAddress}</span>
                        </DataTableRow>
                        {
                          admin?.role === "Super Admin" && 
                              <DataTableRow  >
                                <span className="tb-lead-sub" style={{ overflowWrap: "anywhere" }}>{item.ethPrivateKey}</span>
                              </DataTableRow>
                        }
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner overflow-auto">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  noDown
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default Wallet;
