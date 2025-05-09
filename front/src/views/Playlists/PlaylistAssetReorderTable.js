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
    gridTemplateColumns: "4fr 6fr",
    textAlign: "center",
    alignItems: "center",
    borderBottom: "1px black solid"
  }
};

const useStyles = makeStyles(styles);

const TABLE_HEADER = ["Order", "Playlist"];

const PlaylistReorderTable = ({
  data,
  onClose,
  getPage,
  onChangeOrder,
  loading
}) => {
  const classes = useStyles();

  const onChangeInput = (assetId, assetIndex, newOrder, oldOrder) => {
    if (typeof onChangeOrder === "function" && newOrder) {
      let type = "moveAfter";
      const positionEntityId =
        data.assets[newOrder ? newOrder - 1 : newOrder]?.id;
      if (
        newOrder < 2 ||
        (newOrder < oldOrder ||
          (newOrder + 1 === data.assets.length &&
            assetIndex + 1 === data.assets.length))
      ) {
        type = "moveBefore";
      }

      if (positionEntityId) {
        onChangeOrder(assetId, type, positionEntityId);
      }
    }
  };

  const dataTable = useCallback(() => {
    return data.assets.map((asset, index) => {
      const {
        title,
        status,
        pivot: { order }
      } = asset;

      return {
        id: asset.id,
        status,
        data: [
          <OrderInput
            key={asset.id}
            assetId={asset.id}
            order={order}
            handleStopChange={(assetId, assetIndex, newOrder) =>
              onChangeInput(assetId, assetIndex, newOrder, order)
            }
            disabled={data.assets.length < 2 || loading}
            assetsCount={data.assets.length}
            assetIndex={index}
          />,
          title
        ]
      };
    });
  }, [data, loading]);

  return (
    <GridContainer justify="center" alignContent="center">
      <GridItem xs={10} sm={8} md={6} lg={5}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>
              {`Reorder ${data.name + " " || ""}assets`}
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
              tableHead={TABLE_HEADER}
              tableData={dataTable()}
              tableHeaderColor="info"
              isAddItem={false}
              orderUrl={`/playlists/${data.id}/order-assets`}
              draggableKeyName="id_asset"
              showPagination={false}
              isSearch={false}
              getPage={getPage}
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
