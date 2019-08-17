import React, { useContext } from "react";
import { MutationFunction } from "react-apollo";
import * as styles from "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, CommonFields, AllColumnFields } from "../../types";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";
import { FormManagerState } from "../ColumnsManager/types";
import { openFormAction } from "../ColumnsManager/actions";

interface ColumnProps {
  type: ColumnType;
  tickets: AllColumnFields[];
  displayFields: string[];
  updateTicket: MutationFunction<any, { id: string, params: any }>;
  deleteTicket: (data: CommonFields) => void;
  displayDirection: DisplayDirection;
  isLoading: boolean; // @todo handle loading
}

export const Column: React.FC<ColumnProps> = ({
  tickets,
  type,
  updateTicket,
  deleteTicket,
  displayFields,
  displayDirection,
}) => {
  const { dispatch } = useContext(ReducerContext);
  const openForm = (props: FormManagerState) => openFormAction(dispatch, props);

  const renderTickets = () => {
    return tickets.map((data, index) => (
      <Ticket
        data={data}
        key={index}
        type={type}
        focused={false}
        openForm={openForm}
        updateTicket={updateTicket}
        deleteTicket={deleteTicket}
        displayFields={displayFields}
        displayDirection={displayDirection}
      />
    ));
  };

  return (
    <div className={styles.column}>
      <ColumnHeader type={type} openForm={openForm} />
      <div className={styles.content}>
        {renderTickets()}
      </div>
    </div>
  );
};
