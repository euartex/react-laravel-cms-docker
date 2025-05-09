import React, { useCallback } from "react";
import { func, object, bool } from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "components/DnDTable/DnDTable";
import OrderInput from "./OrderInput";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    display: "flex",
    justifyContent: "space-between"
  },
  closeButton: {
    cursor: "pointer"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  customInput: {
    maxWidth: "160px"
  },
  noMargin: {
    marginLeft: 0,
    marginRight: 0
  },
  DnDrowStyle: {
    background: "white",
    boxSizing: "content-box",
    display: "grid",
    gridTemplateColumns: "3fr 4fr",
    textAlign: "center",
    alignItems: "center",
    borderBottom: "1px black solid"
  }
};

const useStyles = makeStyles(styles);

const TABLE_HEADER = ["Playlist", ""];

const PlaylistReorderTable = ({
  data,
  onClose,
  getPage,
  onChangeOrder,
  loading
}) => {
  const classes = useStyles();

  const onChangeInput = (playlistId, playlistIndex, newOrder, oldOrder) => {
    if (typeof onChangeOrder === "function" && newOrder) {
      let type = "moveAfter";
      const positionEntityId =
        data.playlists[newOrder ? newOrder - 1 : newOrder]?.id;
      if (
        newOrder < 2 ||
        (newOrder < oldOrder ||
          (newOrder + 1 === data.playlists.length &&
            playlistIndex + 1 === data.playlists.length))
      ) {
        type = "moveBefore";
      }

      if (positionEntityId) {
        onChangeOrder(playlistId, type, positionEntityId);
      }
    }
  };

  const dataTable = useCallback(() => {
    return data.playlists.map((playlist, index) => {
      const {
        name,
        id,
        pivot: { order }
      } = playlist;
      return {
        id: playlist.id,
        data: [
          <OrderInput
            key={id}
            playlistId={id}
            order={order}
            handleStopChange={(playlistId, playlistIndex, newOrder) =>
              onChangeInput(playlistId, playlistIndex, newOrder, order)
            }
            disabled={data.playlists.length < 2 || loading}
            playlistsCount={data.playlists.length}
            playlistIndex={index}
          />,
          name
        ]
      };
    });
  }, [data]);

  return (
    <GridContainer justify="center" alignContent="center">
      <GridItem xs={10} sm={8} md={6} lg={5}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>
              {`Reorder ${data.name + " " || ""}playlists`}
              <span
                className={`material-icons ${classes.closeButton}`}
                onClick={onClose}
              >
                clear
              </span>
            </h4>
          </CardHeader>
          <CardBody>
            <Table
              isScrollable
              tableHead={TABLE_HEADER}
              tableData={dataTable()}
              tableHeaderColor="info"
              isAddItem={false}
              orderUrl={`/navigations/${data.id}/order-playlists`}
              showPagination={false}
              isSearch={false}
              getPage={getPage}
              draggableKeyName="id_playlist"
              DnDrowStyle={classes.DnDrowStyle}
            />
          </CardBody>
          <CardFooter className={classes.footer}>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

PlaylistReorderTable.propTypes = {
  data: object,
  onClose: func,
  getPage: func,
  onChangeOrder: func,
  loading: bool
};

export default PlaylistReorderTable;
